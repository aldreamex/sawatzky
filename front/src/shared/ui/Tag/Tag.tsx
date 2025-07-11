import { Mods, classNames } from 'shared/lib/classNames/classNames';
import { ApplicationStatus, ApplicationStatusMessage } from 'entities/Application';
import { memo, useMemo } from 'react';
import cls from './Tag.module.scss';

interface TagProps {
    className?: string;
    status: ApplicationStatus;
}

export const Tag: React.FC<TagProps> = memo((props) => {
  const { className, status = ApplicationStatus.NEW } = props;

  const TagMods: Mods = {
    [cls.new]: status === ApplicationStatus.NEW,
    [cls.coordination]: status === ApplicationStatus.COORDINATION || status === ApplicationStatus.WAITING_FINISH,
    [cls.paymentCoordination]: status === ApplicationStatus.PAYMENT_COORDINATION,
    [cls.inWork]: status === ApplicationStatus.IN_WORK,
    [cls.processed]: status === ApplicationStatus.PROCESSED,
    [cls.finished]: status === ApplicationStatus.FINISHED,
  };

  const statusMessage = useMemo(() => ApplicationStatusMessage[status], [status]);

  return (
    <div className={classNames(cls.tag, TagMods, [className])}>
      {statusMessage}
    </div>
  );
});
