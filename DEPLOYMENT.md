# Gamybos valdymo sistemos diegimo instrukcija

## 1. Supabase duomenų bazės sukūrimas

### 1.1 Sukurkite naują Supabase projektą
1. Eikite į [supabase.com](https://supabase.com)
2. Prisijunkite arba sukurkite paskyrą
3. Sukurkite naują projektą
4. Išsaugokite projekto URL ir anon key

### 1.2 Sukurkite duomenų bazės schemas
1. Atidarykite Supabase SQL Editor
2. Įvykdykite `database/schema.sql` skriptą
3. Patikrinkite, ar visos lentelės sukurtos sėkmingai

### 1.3 Sukurkite pradinius duomenis (pasirinktinai)
```sql
-- Sukurti administratorių
INSERT INTO users (username, email, password_hash, first_name, last_name, role, department)
VALUES ('admin', 'admin@sandelis.lt', '$2a$10$...', 'Administratorius', 'Sistema', 'Admin', 'IT skyrius');
```

## 2. Aplikacijos konfigūracija

### 2.1 Aplinkos kintamieji
1. Nukopijuokite `.env.example` į `.env`
2. Įrašykite savo Supabase duomenis:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2.2 Priklausomybių įdiegimas
```bash
npm install
```

### 2.3 Aplikacijos kompiliavimas
```bash
npm run build
```

## 3. Diegimo variantai

### Variantas A: Vercel (rekomenduojama)
1. Sukurkite Vercel paskyrą
2. Prijunkite GitHub repository
3. Nustatykite aplinkos kintamuosius Vercel dashboard
4. Deploy automatiškai įvyks

### Variantas B: Netlify
1. Sukurkite Netlify paskyrą
2. Drag & drop `dist` katalogą į Netlify
3. Nustatykite aplinkos kintamuosius

### Variantas C: Tradicinis serveris
1. Nukopijuokite `dist` katalogo turinį į web serverį
2. Sukonfigūruokite web serverį (Apache/Nginx)
3. Nustatykite HTTPS sertifikatą

## 4. Po diegimo

### 4.1 Patikrinkite funkcionalumą
- [ ] Prisijungimas veikia
- [ ] Duomenų saugojimas veikia
- [ ] Visi moduliai atsidaro

### 4.2 Sukurkite vartotojus
1. Prisijunkite kaip administratorius
2. Sukurkite reikalingus vartotojus
3. Nustatykite roles ir teises

### 4.3 Importuokite duomenis
1. Importuokite medžiagas
2. Sukurkite klientus
3. Sukurkite formules

## 5. Saugumo rekomendacijos

- Naudokite stiprius slaptažodžius
- Reguliariai darykite duomenų atsargines kopijas
- Nustatykite RLS (Row Level Security) politikas
- Monitorinkite sistemos veiklą

## 6. Palaikymas ir atnaujinimai

- Reguliariai atnaujinkite priklausomybes
- Monitorinkite Supabase naudojimą
- Darykite reguliarias atsargines kopijas

