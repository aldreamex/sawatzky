import { classNames } from 'shared/lib/classNames/classNames';
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis,
} from 'recharts';
import cls from './BarChartElem.module.scss';

interface data {
  title: string;
  stat: number;
}

interface BarChartElemProps {
  className?: string;
  title?: string;
  data: data[];
}

export const BarChartElem: React.FC<BarChartElemProps> = (props) => {
  const { className, title, data } = props;

  // const data = [
  //   {
  //     name: 'Page A',
  //     value: 2400,
  //   },
  //   {
  //     name: 'Page B',
  //     value: 1398,
  //   },
  //   {
  //     name: 'Page C',
  //     value: 9800,
  //   },
  //   {
  //     name: 'Page D',
  //     value: 3908,
  //   },
  //   {
  //     name: 'Page E',
  //     value: 4800,
  //   },
  // ];

  return (
    <div className={classNames(cls.bars, {}, [className])} style={{ width: '100%', height: 300 }}>
      <p className={cls.title}>{title}</p>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
          barSize={32}
          barGap={2}
        >
          <XAxis dataKey="name" scale="point" padding={{ left: 30, right: 30 }} />
          <YAxis />
          <CartesianGrid vertical={false} />
          <Bar
            dataKey="value"
            fill="#3CACDD"
            label={{ position: 'insideTop', fill: 'white' }}
            radius={5}

          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
