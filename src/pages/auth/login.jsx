import {
  Alert,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import axios from "@/utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export function LogIn() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!loginId || !password) {
      setLoginError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "/auth/login",
        { email: loginId, password },
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.data.token && response.data.user) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("authUser", JSON.stringify(response.data.user));

        // Unlock animation before navigating
        setIsUnlocked(true);

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000); // Delay to allow animation to play
      } else {
        setLoginError("Invalid response from server.");
      }
    } catch (error) {
      setLoginError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/img/login-bg.svg')" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="relative w-full max-w-xs"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        {/* Alert*/}
        {loginError && (
          <Alert
            color="red"
            variant="filled"
            className="mb-4"
            onClose={() => setLoginError("")}
          >
            {loginError}
          </Alert>
        )}

        {/* Animated Lock Icon */}
        <motion.div
          className="absolute -top-14 left-[125px] z-10 -translate-x-1/2 rounded-full bg-white p-4 shadow-lg"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.div
            animate={
              isUnlocked ? { rotate: [0, 10, -10, 0], y: [-5, 5, -5, 0] } : {}
            }
            transition={{ duration: 0.7 }}
          >
            {isUnlocked ? (
              <LockOpenIcon
                strokeWidth={2}
                className="h-10 w-10 text-green-600"
              />
            ) : (
              <LockClosedIcon
                strokeWidth={2}
                className="h-10 w-10 text-deep-orange-600"
              />
            )}
          </motion.div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="w-full rounded-xl bg-white p-4 pt-12 shadow-2xl backdrop-blur-md">
            <CardHeader
              variant="gradient"
              color="deep-orange"
              className="mb-4 grid h-24 place-items-center"
            >
              <Typography variant="h4" color="white">
                Admin Login
              </Typography>
            </CardHeader>

            <CardBody className="flex flex-col gap-4">
              <Input
                label="Email"
                value={loginId}
                color="deep-orange"
                onChange={(e) => setLoginId(e.target.value)}
                crossOrigin=""
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  color="deep-orange"
                  onChange={(e) => setPassword(e.target.value)}
                  crossOrigin=""
                />
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="!absolute right-2 top-1"
                >
                  <IconButton
                    variant="text"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      key={showPassword ? "hide" : "show"}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-deep-orange-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-deep-orange-600" />
                      )}
                    </motion.div>
                  </IconButton>
                </motion.div>
              </div>
            </CardBody>

            <CardFooter className="pt-0">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  onClick={handleLogin}
                  fullWidth
                  className="bg-deep-orange-600 hover:bg-deep-orange-700"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log In"}
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default LogIn;
