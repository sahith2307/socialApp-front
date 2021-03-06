import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./login.scss";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { GoogleLogin } from "react-google-login";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { authenticationService } from "../../../utils/auth.service";
import { showErrorToast } from "../../../utils/toastUtil";
import { paths } from "../../../routes/routes.config";
import { Link } from "react-router-dom";
import { userDataChange } from "../../../redux/reducers";
import { useDispatch } from "react-redux";

export default function Login() {
  // Initial hooks
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const { handleSubmit, register } = useForm();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    showPassword: false,
  });
  const onClickShowPassword = () => {
    setData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };
  const responseGoogle = async (response: any) => {
    console.log(response.tokenId);
    const userData = await authenticationService.googleLogin({
      idToken: response.tokenId,
    });
    console.log(userData);
    setButtonDisabled(false);
    await dispatch(userDataChange(userData));
    await fetchUser(userData.token);
  };

  /*
   * Verify Credentials
   */
  const doLogin = async (formData: any) => {
    const emailVerify = authenticationService.emailVerification(formData.email);
    const passwordVerify = authenticationService.passwordVerification(
      formData.password
    );
    setButtonDisabled(true);
    if (emailVerify && passwordVerify) {
      const userData = await authenticationService.verifyCredentials(formData);
      setButtonDisabled(false);
      await dispatch(userDataChange(userData));
      await fetchUser(userData.token);
    } else {
      showErrorToast("give valid credentials");
      setButtonDisabled(false);
    }
    setButtonDisabled(false);
  };
  const fetchUser = async (token: string) => {
    const userDetails = await authenticationService.loadCurrentUser(token);
    dispatch(userDataChange(userDetails));
  };
  /*
   * Render
   */
  return (
    <div className="main-container">
      <form onSubmit={handleSubmit(doLogin)}>
        <Box className="boxShadow">
          <h2>Signin to Social Feed</h2>
          <TextField
            id="email"
            label="email"
            variant="outlined"
            // onChange={onChangeEmail}
            sx={{ width: "80%", mr: 1 }}
            {...register("email")}
          />

          <FormControl sx={{ width: "80%" }} variant="outlined">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={data.showPassword ? "text" : "password"}
              // onChange={onChangePassword}
              {...register("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onClickShowPassword}
                    edge="end"
                  >
                    {data.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ width: "80%" }}
            loading={isButtonDisabled}
          >
            Sign In
          </LoadingButton>
          <p className="forget">
            <Link to={paths.forgotPassword}>forget password?</Link>
          </p>
          <p className="signIn">
            Don't have Account?
            <Link to={paths.signup}>Sign up</Link>
          </p>
          <h2 className="or">OR</h2>
          <GoogleLogin
            className="google"
            clientId="976789947474-a3d4hteu14kc4ve10ue9500digrbe69j.apps.googleusercontent.com"
            buttonText="Sign in With Google"
            onSuccess={responseGoogle}
          />
        </Box>
      </form>
    </div>
  );
}
