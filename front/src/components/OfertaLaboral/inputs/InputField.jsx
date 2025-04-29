import { TextField, Typography } from "@mui/material";

function InputField({ name, label, register, errors, type = "text", sx = {}, ...props }) {
  return (
    <div className="w-full">
      <Typography
        variant="subtitle2" // subtítulo pequeño
        sx={{
          marginBottom: '4px',
          fontWeight: 600,
          textAlign: 'left', 
          color: '#333', // Color del título
          fontSize: '17px',
          fontFamily: 'sans-serif'
        }}
      >
        {label}
      </Typography>

      <TextField
        variant="outlined"
        type={type}
        {...register(name)}
        error={!!errors?.[name]}
        helperText={errors?.[name]?.message}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px', // Bordes redondeados
            backgroundColor: '#fff', // Fondo blanco
            padding: '5.5px', // Elimina el padding extra del contenedor
      
            '& input': {
              padding: '10px 14px', // Padding del texto interno
              fontFamily: 'sans-serif',
              fontSize: '16px',
            },
      
            '&:hover fieldset': {
              borderColor: '#555', // Borde al pasar el mouse
            },
            '&.Mui-focused fieldset': {
              borderColor: '#25BF7B', // Borde azul cuando haces focus
              borderWidth: '2px', // Más grueso en focus
            },
          },
        }}
        {...props}
      />
    </div>
  );
}

export default InputField;
