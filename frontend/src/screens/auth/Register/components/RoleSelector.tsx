import { Box, Typography } from "@mui/material";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import SearchIcon from "@mui/icons-material/Search";
import { Control, Controller } from "react-hook-form";

const ROLES = [
  {
    value: "RENTER" as const,
    icon: <SearchIcon fontSize="large" />,
    title: "Renter",
    desc: "Find and book apartments for your travels",
  },
  {
    value: "LANDLORD" as const,
    icon: <HomeWorkIcon fontSize="large" />,
    title: "Landlord",
    desc: "List your property and earn money",
  },
];

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
}

export function RoleSelector({ control }: Props) {
  return (
    <Box>
      <Typography variant="body2" fontWeight={600} mb={1.5} color="text.secondary">
        I want to...
      </Typography>
      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <Box sx={{ display: "flex", gap: 2 }}>
            {ROLES.map((role) => {
              const active = field.value === role.value;
              return (
                <Box
                  key={role.value}
                  onClick={() => field.onChange(role.value)}
                  sx={{
                    flex: 1,
                    p: 2.5,
                    textAlign: "center",
                    cursor: "pointer",
                    border: "2px solid",
                    borderColor: active ? "primary.main" : "grey.200",
                    borderRadius: 2,
                    bgcolor: active ? "rgba(255, 90, 95, 0.06)" : "white",
                    transition: "all 0.2s",
                    userSelect: "none",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                >
                  <Box sx={{ color: active ? "primary.main" : "grey.400", mb: 1 }}>
                    {role.icon}
                  </Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {role.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {role.desc}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      />
    </Box>
  );
}
