import { TextField, Typography } from "@mui/material";

function DateField({ name, label, register, errors, sx = {}, ...props }) {
  return (
    <div className="w-full">
      <Typography
        variant="subtitle2"
        sx={{
          marginBottom: '5px',
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
        type="date" // Tipo de input para fecha
        variant="outlined"
        {...register(name)} // Conectar con React Hook Form
        error={!!errors?.[name]} // Mostrar error si existe
        helperText={errors?.[name]?.message} // Mostrar mensaje de error
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#fff',
            padding: '8px',
            alignItems: 'center',
            '& input': {
              padding: '8px 10px', // Padding del texto
              fontFamily: 'sans-serif',
              fontSize: '15px',
              textAlign: 'left',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#25BF7B', // Borde cuando está en focus
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: '#555', // Borde al pasar el mouse
            },
          },
        }}
        {...props}
      />
    </div>
  );
}

export default DateField;
