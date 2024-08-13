import { classNames } from 'shared/lib/classNames/classNames';
import { Comment } from 'entities/Comment';
import { getDateString } from 'shared/lib/getDateString/getDateString';
import { getTimeString } from 'shared/lib/getTimeString/getTimeString';
import cls from './CommentBlock.module.scss';

interface CommentProps {
  className?: string;
  data: Comment;
}

export const CommentBlock: React.FC<CommentProps> = (props) => {
  const {
    className, data,
  } = props;

  return (
    <div className={classNames(cls.commentWrap, {}, [className])}>
      <div className={cls.info}>
        <p className={cls.name}>{data?.creator}</p>
        <p className={cls.date}>{getDateString(new Date(data.created_at))}</p>
        <p className={cls.time}>{getTimeString(new Date(data.created_at))}</p>
      </div>
      <p className={cls.comment}>{data?.description}</p>
    </div>
  );
};
