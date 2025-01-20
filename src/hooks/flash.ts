import { CreateFlashInput, UpdateFlashInput } from "@/domain/flash/service";
import { FlashPageableOptions } from "@/domain/flash/service";

import * as actions from "@/actions/flash";

export const useFlash = () => {

  const getFlash = async (id: string) => {
    const data = await actions.getFlash(id);

    if (data && 'error' in data && data.error) {
      throw data.error;
    }

    return data;
  };

  const getFlashes = async (options: FlashPageableOptions) => {
    const data = await actions.getFlashes(options);

    if (data && 'error' in data && data.error) {
      throw data.error;
    }

    return data;
  };

  const createFlash = async (flash: CreateFlashInput) => {
    const data = await actions.createFlash(flash);

    if (data && 'error' in data && data.error) {
      throw data.error;
    }

    return data;
  };

  const updateFlash = async (id: string, flash: UpdateFlashInput) => {
    const data = await actions.updateFlash(id, flash);

    if (data && 'error' in data && data.error) {
      throw data.error;
    }

    return data;
  };

  const deleteFlash = async (id: string) => {
    const data = await actions.deleteFlash(id);

    if (data && 'error' in data && data.error) {
      throw data.error;
    }

    return data;
  };

  const likeFlash = async (id: string) => {
    const data = await actions.likeFlash(id);

    if (data && 'error' in data && data.error) {
      throw data.error;
    }

    return data;
  };

  const unlikeFlash = async (id: string) => {
    const data = await actions.unlikeFlash(id);

    if (data && 'error' in data && data.error) {
      throw data.error;
    }

    return data;
  };

  return {
    getFlash,
    getFlashes,
    createFlash,
    updateFlash,
    deleteFlash,
    likeFlash,
    unlikeFlash,
  };
};
