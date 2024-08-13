import { classNames } from 'shared/lib/classNames/classNames';
import {
  ChangeEvent, DragEvent, useCallback, useState,
} from 'react';
import cls from './FileInput.module.scss';

interface FileInputProps {
  className?: string;
  label?: any;
  id?: string;
  value?: File;
  onFileChange?: (value: File) => void;
  onBlur?: () => void;
  required?: boolean;
  isError?: boolean;
}

export const FileInput: React.FC<FileInputProps> = (props) => {
  const {
    className,
    id,
    label,
    value,
    onFileChange,
    required = false,
    onBlur,
    isError,
  } = props;

  const [drag, setDrag] = useState(false);

  const dragStartHandler = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDrag(true);
  }, []);

  const dragLeaveHandler = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    onBlur?.();
  }, [onBlur]);

  const dragDropHandler = useCallback((e: DragEvent) => {
    e.preventDefault();
    const files = [...e.dataTransfer.files];
    onFileChange?.(files[0]);
    setDrag(false);
    onBlur?.();
  }, [onFileChange, onBlur]);

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;
    onFileChange?.(files!![0]);
  }, [onFileChange]);

  return (
    <div
      className={classNames(cls.fileInput, { [cls.error]: isError, [cls.dropFile]: drag }, [className])}
      onDragStart={dragStartHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragStartHandler}
      onDrop={dragDropHandler}
    >
      <div className={cls.fileContent}>
        {
          value && <span className={cls.fileName}>Выбранный файл: <a href={`${URL.createObjectURL(value)}`} download={value.name}>{value.name}</a> </span>
        }
        <input onBlur={onBlur} required={required} type="file" onChange={(e) => onChangeHandler(e)} id={`${id}`} className={cls.input} />
        <label htmlFor={`${id}`} className={cls.label}> {label} </label>
      </div>
    </div>
  );
};
