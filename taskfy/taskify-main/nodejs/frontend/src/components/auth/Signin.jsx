import React, { useCallback, useState, useRef, useEffect } from "react";
import TextBox from "devextreme-react/text-box";
import { Button } from "devextreme-react/button";
import { Link, useNavigate } from "react-router-dom";
import notify from "devextreme/ui/notify";
import authApi from "../../API/taskifyAi/auth";

const SignIn = () => {
  const navigate = useNavigate();
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordMode, setPasswordMode] = useState("password");

  const handleEmailChange = useCallback((e) => {
    setEmailValue(e.value.replace(/\s/g, "").toLowerCase());
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPasswordValue(e.value);
  }, []);

  const togglePasswordVisibility = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    setPasswordMode((prevMode) => (prevMode === "text" ? "password" : "text"));
  }, []);

  const handleSignIn = useCallback(
    async (e) => {
      if (loading) return;

      try {
        setLoading(true);

        if (!emailValue || !passwordValue) {
          notify({
            message: "Lütfen tüm alanları doldurun",
            type: "error",
            displayTime: 2000,
            position: { at: "top center", my: "top center" },
          });
          return;
        }

        const response = await authApi.signin(emailValue, passwordValue);

        if (response.success) {
          localStorage.setItem("token", response.accessToken);

          notify({
            message: "Giriş başarılı",
            type: "success",
            displayTime: 2000,
            position: { at: "top center", my: "top center" },
          });

          navigate("/home");
        } else {
          notify({
            message: response.message || "Giriş başarısız",
            type: "error",
            displayTime: 2000,
            position: { at: "top center", my: "top center" },
          });
        }
      } catch (error) {
        notify({
          message: error.message || "Bağlantı hatası oluştu",
          type: "error",
          displayTime: 2000,
          position: { at: "top center", my: "top center" },
        });
      } finally {
        setLoading(false);
      }
    },
    [emailValue, passwordValue, navigate, loading]
  );

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[#292a2d]">
      <div className="form-container">
        <div>
          <h1 className="text-amber-50 text-3xl justify-center flex p-4">
            Giriş Yap
          </h1>
          <div className="email-field-container relative">
            <TextBox
              showClearButton={true}
              placeholder="Email"
              value={emailValue}
              onValueChanged={handleEmailChange}
              valueChangeEvent="keyup"
              stylingMode="outlined"
              width="100%"
            />
          </div>

          <div className="password-field-container relative mt-4">
            <TextBox
              mode={passwordMode}
              placeholder="Şifre"
              value={passwordValue}
              onValueChanged={handlePasswordChange}
              stylingMode="outlined"
              width="100%"
            />
            <button
              type="button"
              className="password-toggle-absolute-btn"
              onClick={togglePasswordVisibility}
              tabIndex="-1"
            >
              <i
                className={`fa ${
                  passwordMode === "text" ? "fa-eye-slash" : "fa-eye"
                }`}
              ></i>
            </button>
          </div>
        </div>

        <div className="mt-5 flex justify-between">
          <div className="  ">
            <Button
              className="custom-button"
              width="100%"
              text={loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              onClick={handleSignIn}
              disabled={loading}
            />
          </div>
          <div>
            <Link to="/signup">
              <div className="">
                <Button
                  text="Kayıt Olun"
                  width="100%"
                  className="custom-button"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
