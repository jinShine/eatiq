import { useCallback, useState } from "react";

/**
 * 모달, 드로어, 팝오버 등의 열림/닫힘 상태를 관리하는 hook입니다.
 * 상태와 함께 데이터를 저장할 수 있어, 열 때 특정 데이터를 전달하고 닫을 때 초기화할 수 있습니다.
 *
 * @template T - 저장할 데이터의 타입 (기본값: unknown)
 * @returns disclosure 상태와 제어 함수를 포함한 객체
 * @returns returns.isOpen - 현재 열림 상태
 * @returns returns.data - 저장된 데이터 (열 때 전달된 데이터)
 * @returns returns.onOpen - 열기 함수 (데이터를 선택적으로 전달 가능)
 * @returns returns.onClose - 닫기 함수 (데이터를 초기화하고 상태를 닫음)
 *
 * @example
 * ```tsx
 * const MyModal = () => {
 *   const { isOpen, data, onOpen, onClose } = useDisclosure<{ id: number; name: string }>();
 *
 *   const handleOpen = () => {
 *     onOpen({ id: 1, name: "Example" });
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={handleOpen}>열기</button>
 *       {isOpen && (
 *         <Modal onClose={onClose}>
 *           <p>ID: {data?.id}</p>
 *           <p>Name: {data?.name}</p>
 *         </Modal>
 *       )}
 *     </>
 *   );
 * };
 * ```
 */
export default function useDisclosure<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = useCallback((data?: T) => {
    setData(data ?? null);
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setData(null);
    setIsOpen(false);
  }, []);

  return {
    data,
    isOpen,
    onOpen,
    onClose,
  };
}
