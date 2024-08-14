import React from 'react';
import { Mods, classNames } from 'shared/lib/classNames/classNames';
import cls from './CircleProgress.module.scss';

interface CircleProgressPorps {
  className?: string;
  percent?: string | number;
  title?: string;
}

export const CircleProgress: React.FC<CircleProgressPorps> = (props) => {
  const { className, percent = 0, title } = props;

  const modsItem: Mods = {
    [cls.red]: +percent < 50,
    [cls.yellow]: +percent >= 50 && +percent < 75,
    [cls.blue]: +percent >= 75,
  };

  return (
    <div className={classNames(cls.wrapper, {}, [className])}>
      <p className={cls.title}>{title}</p>
      <div className={cls.single}>
        <svg viewBox="0 0 36 36" className={classNames(cls.circular, modsItem, [])}>
          <path
            className={cls.circleBg}
            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={cls.circle}
            strokeDasharray={`${percent}, 100`}
            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" className={classNames(cls.percentage, modsItem, [])}>{percent}%</text>
        </svg>
      </div>
    </div>
  );
};
