import { useEffect, useMemo } from 'react';
import cls from './Progressbar.module.scss';
import { ProgressbarStep } from '../ProgressbarStep/ProgressbarStep';

interface ProgressbarProps {
  className?: string;
  step: number;
  prepayment: boolean;
}

export const Progressbar: React.FC<ProgressbarProps> = (props) => {
  const { step, prepayment } = props;

  useEffect(() => {
    const stepId = step.toString();
    const activeStep = document.getElementById(stepId);
    activeStep?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'end' });
  }, [step]);

  const ProgressSteps = useMemo(() => {
    const steps: { id: string, title: string }[] = prepayment ? [
      { id: '1', title: 'Новая' },
      { id: '2', title: 'Обрабатывается' },
      { id: '3', title: 'На согласовании у заказчика' },
      { id: '4', title: 'Стоимость работ' },
      { id: '5', title: 'В работе' },
      { id: '6', title: 'На согласовании у заказчика' },
      { id: '7', title: 'Сделано' },
    ] : [
      { id: '1', title: 'Новая' },
      { id: '2', title: 'Обрабатывается' },
      { id: '3', title: 'На согласовании у заказчика' },
      { id: '4', title: 'В работе' },
      { id: '5', title: 'На согласовании у заказчика' },
      { id: '6', title: 'Сделано' },
    ];

    return steps;
  }, [prepayment]);

  return (
    <div className={cls.progressbar}>
      <ul className={cls.list} id="progress">
        {ProgressSteps.map((item) => <ProgressbarStep prepayment={prepayment} step={step} id={item.id} title={item.title} key={item.id} />)}
      </ul>
    </div>
  );
};
