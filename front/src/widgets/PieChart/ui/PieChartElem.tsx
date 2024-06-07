import { classNames } from 'shared/lib/classNames/classNames';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from 'recharts';
import cls from './PieChartElem.module.scss';

interface data {
  title: string;
  stat: number;
}

interface PieChartProps {
  className?: string;
  title?: string;
  data: data[];
}

export const PieChartElem: React.FC<PieChartProps> = (props) => {
  const { className, title, data } = props;

  const COLORS = ['#D8EEF8', '#DD453C', '#FFBD22', '#3CACDD', '#5AC87A'];

  // const pieData = [
  //   {
  //     name: 'Chrome',
  //     value: 68.85,
  //   },
  //   {
  //     name: 'Firefox',
  //     value: 7.91,
  //   },
  //   {
  //     name: 'Edge',
  //     value: 6.85,
  //   },
  //   {
  //     name: 'Internet Explorer',
  //     value: 6.14,
  //   },
  //   {
  //     name: 'Others',
  //     value: 10.25,
  //   },
  // ];

  return (
    <div
      className={classNames(cls.pie, {}, [className])}
      style={{ width: '100%', height: 300 }}
    >
      <p className={cls.title}>{title}</p>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            paddingAngle={1}
            nameKey="name"
            dataKey="value"
            data={data}
            fill="#8884d8"
            labelLine={false}
            label
          >
            {data.map((entry, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
