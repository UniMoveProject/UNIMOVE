-- Adiciona coluna para foto do veículo na tabela rides
ALTER TABLE rides ADD COLUMN IF NOT EXISTS foto_veiculo TEXT;

-- Bucket de storage para fotos de veículos (rodar no Storage do Supabase)
-- insert into storage.buckets (id, name, public) values ('car-photos','car-photos',true);
