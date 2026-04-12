# GrooveLink Frontend

## Configuracion de entorno

1. Crea un archivo `.env` en la raiz del proyecto.
2. Usa este contenido como base:

```env
VITE_API_URL=http://localhost:8080
```

Tambien tienes un ejemplo en `.env.example`.

## Flujo de autenticacion implementado

- Context global en `src/context/AuthProvider.jsx`.
- Cliente API en `src/api/config.js` y `src/api/auth.js`.
- Login y registro conectados desde los formularios.

Endpoints esperados del backend:

- `POST /auth/login`
- `POST /auth/register`

Formato esperado de respuesta (ejemplo):

```json
{
	"token": "jwt_aqui",
	"user": {
		"id": 1,
		"username": "juan"
	}
}
```

## Scripts

- `npm run dev` para desarrollo
- `npm run build` para build de produccion
- `npm run preview` para previsualizar build
