import { TextField, MenuItem, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

function SelectField({ name, label, control, errors, options = [], sx = {}, ...props }) {
  return (
    <div className="w-full">
      <Typography
        variant="subtitle2"
        sx={{
          marginBottom: '1px',
          fontWeight: 600,
          textAlign: 'left',
          color: '#333',
          fontSize: '17px',
          fontFamily: 'sans-serif',
        }}
      >
        {label}
      </Typography>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            select
            variant="outlined"
            {...field} 
            error={!!errors?.[name]}
            helperText={errors?.[name]?.message}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#fff',
                padding: '0',
                alignItems: 'center',

                '& select': {
                  padding: '6px 8px',
                  fontFamily: 'sans-serif',
                  fontSize: '15px',
                  textAlign: 'left',
                },

                '&.Mui-focused fieldset': {
                  borderColor: '#25BF7B',
                  borderWidth: '2px',
                },

                '&:hover fieldset': {
                  borderColor: '#555',
                },
              },

              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
              },
              ...sx,
            }}
            {...props}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </div>
  );
}

export default SelectField;
