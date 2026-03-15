import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useRegisterController } from "./useRegisterController";
import { RoleSelector } from "./components/RoleSelector";

export default function Register() {
  const { form, onSubmit, isSubmitting } = useRegisterController();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.50",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Typography variant="h5" fontWeight={800} color="primary">
              StayFlow
            </Typography>
          </Link>
          <Typography variant="h6" fontWeight={700} mt={1}>
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join thousands of travelers and landlords
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Box
            component="form"
            onSubmit={onSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <RoleSelector control={control} />

            <Divider />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="First name"
                fullWidth
                {...register("firstName", { required: "First name is required" })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
              <TextField
                label="Last name"
                fullWidth
                {...register("lastName", { required: "Last name is required" })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Box>

            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Phone number"
              fullWidth
              {...register("phoneNumber", { required: "Phone number is required" })}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSubmitting}
              sx={{ mt: 0.5, py: 1.5, fontWeight: 700 }}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "inherit", fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
