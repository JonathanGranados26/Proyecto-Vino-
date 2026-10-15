import React, { useState, useCallback } from 'react';
import { useMutation, gql } from '@apollo/client';

const UPDATE_PRODUCT_STATUS_MUTATION = gql`
  mutation UpdateProductStatus($id: String!, $isActive: Boolean!) {
    updateProductStatus(id: $id, isActive: $isActive) {
      id
      isActive
    }
  }
`;

interface StatusToggleProps {
  productId: string;
  initialStatus: boolean;
  onStatusChange?: (newStatus: boolean) => void;
}

export const StatusToggle: React.FC<StatusToggleProps> = ({
  productId,
  initialStatus,
  onStatusChange,
}) => {
  const [isChecked, setIsChecked] = useState(initialStatus);
  const [isReverting, setIsReverting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const [updateStatus, { loading }] = useMutation(
    UPDATE_PRODUCT_STATUS_MUTATION,
    {
      optimisticResponse: {
        updateProductStatus: {
          __typename: 'ProductType',
          id: productId,
          isActive: !isChecked,
        },
      },
      onCompleted: () => {
        setToastType('success');
        setToastMessage('Estado actualizado');
        setTimeout(() => setToastMessage(null), 4000);
      },
      onError: (error) => {
        setIsChecked(initialStatus);
        setToastType('error');
        setToastMessage('Error al guardar');
        console.error('[StatusToggle] Error:', error);
        setTimeout(() => setToastMessage(null), 4000);
      },
    },
  );

  const handleUndo = useCallback(() => {
    if (isReverting) return;
    setIsReverting(true);
    const previousState = !isChecked;
    setIsChecked(previousState);
    onStatusChange?.(previousState);
    updateStatus({ variables: { id: productId, isActive: previousState } });
    setToastType('success');
    setToastMessage('Cambio revertido');
    setIsReverting(false);
    setTimeout(() => setToastMessage(null), 3000);
  }, [isChecked, productId, updateStatus, isReverting, onStatusChange]);

  const handleChange = useCallback(
    (checked: boolean) => {
      if (loading || isReverting) return;
      setIsChecked(checked);
      onStatusChange?.(checked);
      updateStatus({ variables: { id: productId, isActive: checked } });
    },
    [productId, loading, isReverting, updateStatus, onStatusChange],
  );

  return (
    <div className="relative inline-flex items-center">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isChecked}
          onChange={(e) => handleChange(e.target.checked)}
          disabled={loading || isReverting}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-wine-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-wine-600"></div>
      </label>
      
      {toastMessage && (
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg shadow-lg z-50 min-w-[180px] text-sm ${
          toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium">{toastMessage}</span>
            {toastType === 'success' && (
              <button onClick={handleUndo} className="text-xs font-bold underline hover:no-underline whitespace-nowrap">
                Deshacer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};