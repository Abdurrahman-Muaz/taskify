import React, { useCallback, useState } from "react";
import TextBox from "devextreme-react/text-box";
import { Button } from "devextreme-react/button";
import { Link, useNavigate } from "react-router-dom";
import notify from "devextreme/ui/notify";
import authApi from "../../API/taskifyAi/auth";
const Signup = () => {
  const navigate = useNavigate();
  const [nameValue, setNameValue] = useState("");
  const [surnameValue, setSurnameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = useCallback((e) => {
    setNameValue(e.value);
  }, []);
  const handleSurnameChange = useCallback((e) => {
    setSurnameValue(e.value);
  }, []);
  const handleEmailChange = useCallback((e) => {
    setEmailValue(e.value.replace(/\s/g, "").toLowerCase());
  }, []);
  const handlePasswordChange = useCallback((e) => {
    setPasswordValue(e.value);
  }, []);

  const handleSignUp = useCallback(
    async (e) => {
      if (isSubmitting) return;

      try {
        setIsSubmitting(true);

        if (!nameValue || !surnameValue || !emailValue || !passwordValue) {
          notify({
            message: "Lütfen tüm alanları doldurun",
            type: "error",
            displayTime: 2000,
            position: { at: "top center", my: "top center" },
          });
          return;
        }

        const userData = {
          name: nameValue,
          surname: surnameValue,
          email: emailValue,
          password: passwordValue,
        };

        const response = await authApi.signup(userData);

        if (response.success) {
          notify({
            message: "Kayıt başarılı",
            type: "success",
            displayTime: 2000,
            position: { at: "top center", my: "top center" },
          });
          navigate("/signin");
        } else {
          notify({
            message: response.message || "Kayıt başarısız",
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
        setIsSubmitting(false);
      }
    },
    [nameValue, surnameValue, emailValue, passwordValue, navigate, isSubmitting]
  );

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[#292a2d]">
      <div>
        <h1 className="text-amber-50 text-3xl  justify-center flex p-4">
          Kayıt Ol
        </h1>
        <div className="rounded-lg w-70">
          <div className="">
            <div className="dx-field ">
              <div className=" p-4 text-white">
                <TextBox
                  showClearButton={true}
                  placeholder="Name"
                  value={nameValue}
                  onValueChanged={handleNameChange}
                  valueChangeEvent="keyup"
                  stylingMode="outlined"
                  width="100%"
                />
              </div>
            </div>
            <div className="dx-field">
              <div className="p-4">
                <TextBox
                  showClearButton={true}
                  placeholder="Surname"
                  value={surnameValue}
                  onValueChanged={handleSurnameChange}
                  valueChangeEvent="keyup"
                  stylingMode="outlined"
                  width="100%"
                />
              </div>
            </div>

            <div className="dx-field">
              <div className="p-4">
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
            </div>

            <div className="dx-field">
              <div className="p-4">
                <TextBox
                  mode="password"
                  placeholder="Password"
                  value={passwordValue}
                  onValueChanged={handlePasswordChange}
                  valueChangeEvent="keyup"
                  stylingMode="outlined"
                  width="100%"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center p-4 ">
          <div className=" w-27 mr-4">
            <Button
              width="100%"
              className="dx-button-mode-contained custom-button"
              text={isSubmitting ? "Gönderiliyor..." : "Gönder"}
              onClick={handleSignUp}
              disabled={isSubmitting || !isValidEmail(emailValue)}
              stylingMode="contained"
              alignment="center"
              elementAttr={{
                className: "text-center",
              }}
            />
          </div>
          <div className="w-27">
            <Link to="/signin" className="block w-full">
              <Button
                width="100%"
                text="Sign In"
                className="custom-button"
                stylingMode="contained"
                elementAttr={{
                  className: "text-center",
                }}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
