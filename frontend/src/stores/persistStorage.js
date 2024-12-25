import { createJSONStorage } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { persist } from "zustand/middleware";

export const persistStorage = createJSONStorage(() => localStorage); // Можно заменить localStorage на другой storage

export const withPersistAndDevtools = (config, name) =>
  devtools(
    persist(config, {
      name, // Уникальное имя для хранилища
      storage: persistStorage,
    })
  );
