import { Mods, classNames } from 'shared/lib/classNames/classNames';
import {
  ReactNode, useCallback, useEffect, useRef, useState,
} from 'react';
import { Portal } from 'shared/ui/Portal/Portal';
import { ReactComponent as CloseIcon } from 'shared/assets/icons/close-icon.svg';
import cls from './Modal.module.scss';

interface ModalProps {
  className?: string;
  children?: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

const ANIMATION_DELAY = 200;

export const Modal: React.FC<ModalProps> = (props) => {
  const {
    className,
    children,
    isOpen = false,
    onClose,
  } = props;

  const [isClosing, setIsClosing] = useState(false);
  const closeBtnRef = useRef(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const closeHandler = useCallback(() => {
    if (onClose) {
      setIsClosing(true);
      timerRef.current = setTimeout(() => {
        onClose();
        setIsClosing(false);
      }, ANIMATION_DELAY);
    }
  }, [onClose]);

  const overlayClickHandler = useCallback((e: any) => {
    if (e.target === closeBtnRef.current) {
      closeHandler();
    }
  }, [closeHandler]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeHandler();
    }
  }, [closeHandler]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onKeyDown]);

  const mods: Mods = {
    [cls.opened]: isOpen,
    [cls.isClosing]: isClosing,
  };

  return (
    <Portal>
      <div className={classNames(cls.modal, mods)}>
        <div className={cls.overlay}>
          <div className={classNames(cls.content, {}, [className])}>
            <div className={cls.btn} onClick={overlayClickHandler} ref={closeBtnRef}>
              <CloseIcon className={cls.icon} />
            </div>
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};
