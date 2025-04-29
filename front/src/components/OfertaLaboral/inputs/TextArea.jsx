import { TextField, Typography } from "@mui/material";

function TextArea({ name, label, register, errors, rows = 4, sx = {}, ...props }) {
  return (
    <div className="w-full">
      <Typography
        variant="subtitle2"
        sx={{
          marginBottom: '4px',
          fontWeight: 600,
          textAlign: 'left',
          color: '#333',
          fontSize: '17px',
          fontFamily: 'sans-serif',
        }}
      >
        {label}
      </Typography>

      <TextField
        multiline
        rows={rows}
        variant="outlined"
        {...register(name)}
        error={!!errors?.[name]}
        helperText={errors?.[name]?.message}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#fff',
            padding: '0',
            alignItems: 'center',

            '& textarea': {
              padding: '10px 14px',
              fontFamily: 'sans-serif',
              fontSize: '16px',
              textAlign: 'left',
            },

            '&.Mui-focused fieldset': {
              borderColor: '#25BF7B',
              borderWidth: '2px',
            },

            '&:hover fieldset': {
              borderColor: '#25BF7B',
            },
          },
        }}
        {...props}
      />
    </div>
  );
}

export default TextArea;
