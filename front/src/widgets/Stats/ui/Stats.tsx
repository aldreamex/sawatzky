import { classNames } from 'shared/lib/classNames/classNames';
import cls from './Stats.module.scss';

interface subStat {
  title: string;
  stat: number;
}

interface StatsProps {
  className?: string;
  title?: string;
  stat?: string;
  theme?: StatThemes;
  subStats?: subStat[];
}

export enum StatThemes {
  BLUE = 'blue',
  YELLOW = 'yellow',
  RED = 'red',
}

export const Stats: React.FC<StatsProps> = (props) => {
  const {
    className, title, stat, theme = StatThemes.BLUE, subStats,
  } = props;

  return (
    <div className={classNames(cls.stats, {}, [className])}>
      <div className={cls.main}>
        <p className={cls.title}>{title}</p>
        <p className={classNames(cls.mainStat, {}, [cls[theme]])}>{stat}</p>
      </div>

      {subStats && (
        <div className={cls.subs}>
          {subStats?.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div className={cls.sub} key={index}>
              <p className={cls.subTitle}>{item.title}</p>
              <p className={cls.subStat}>{item.stat}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
