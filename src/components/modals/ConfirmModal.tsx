import { useModal } from '@/contexts/ModalContext';
import { Modal } from '../Modal';

interface ModalCancelProps {
  text: string;
  function: () => void;
  isLoading: boolean;
}

export function ConfirmModal({
  text,
  function: handleFunction,
  isLoading,
}: ModalCancelProps) {
  const { closeModal } = useModal();

  return (
    <Modal>
      <div className="bg-white p-10 w-full mx-auto z-10">
        <h2 className="text-black text-center text-xl font-semibold mb-10">
          Deseja {text} a consulta?
        </h2>

        <div className="flex justify-center space-x-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleFunction}
            disabled={isLoading}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()}{' '}
            consulta
          </button>
        </div>
      </div>
    </Modal>
  );
}
