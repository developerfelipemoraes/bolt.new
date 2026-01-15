# Arquitetura de API Centralizada

Este diretório contém a nova camada de abstração para comunicação com as APIs do sistema (Auth, Contacts, Company, Vehicle).

## Estrutura

- **config/**: Configurações de ambiente e mapeamento de URLs.
  - `environments.ts`: Carrega variáveis de ambiente (VITE_*) com fallbacks.
  - `api.config.ts`: Centraliza as Base URLs por domínio.
- **factory/**: Padrão Factory para criação de instâncias Axios.
  - `apiFactory.ts`: Singleton que configura interceptors (Token, Erros, Timeout) e provê helper `handleRequest` para padronizar respostas.
- **services/**: Serviços divididos por domínio de negócio.
  - **auth/**: Login, Logout, Usuários.
  - **contacts/**: CRUD de Contatos.
  - **company/**: CRUD de Empresas e Convites.
  - **vehicle/**: CRUD de Veículos e Upload.

## Como Usar

### Importando um Serviço

```typescript
import { AuthService } from '@/api/services/auth/auth.service';
import { VehicleService } from '@/api/services/vehicle/vehicle.service';

// Exemplo de uso
const login = async () => {
  const result = await AuthService.login({ email: '...', password: '...' });
  if (result.Success) {
    console.log(result.Data.user);
  } else {
    console.error(result.Error);
  }
}
```

## Configuração

Certifique-se de que as variáveis de ambiente estejam definidas no `.env`:

```bash
VITE_API_AUTH_URL=...
VITE_API_CONTACT_URL=...
VITE_API_COMPANY_URL=...
VITE_API_VEHICLE_URL=...
```

## Migração

Esta estrutura visa substituir os antigos serviços em `src/services/`. A migração deve ser feita gradualmente, substituindo as importações nos componentes.
