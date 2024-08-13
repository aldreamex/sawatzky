import { Mods, classNames } from 'shared/lib/classNames/classNames';
import { ReactComponent as DoneIcon } from 'shared/assets/icons/done-status.svg';
import cls from './ProgressbarStep.module.scss';

interface ProgressStepProps {
  className?: string;
  id: string;
  step: number;
  title: string;
  prepayment: boolean;
}

export const ProgressbarStep: React.FC<ProgressStepProps> = (props) => {
  const {
    id,
    title,
    step,
    prepayment,
  } = props;

  const modsItem: Mods = {
    [cls.left]: +id > 1,
    [cls.right]: prepayment ? +id < 7 : +id < 6,
    [cls.done]: +id < step,
    [cls.step]: +id > step,
    [cls.current]: +id === step,
  };

  const modsIcon: Mods = {
    [cls.done]: +id <= step,
    [cls.step]: +id > step,
    [cls.current]: +id === step + 1,
  };

  return (
    <li className={classNames(cls.item, modsItem, [])} id={id}>
      <div className={classNames(cls.icon, modsIcon, [])}>
        {+id > step ? id : <DoneIcon />}
      </div>
      <p className={cls.title}>{title}</p>
    </li>
  );
};
