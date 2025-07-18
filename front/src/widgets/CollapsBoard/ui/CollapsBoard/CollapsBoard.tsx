import { classNames } from 'shared/lib/classNames/classNames';
import { ReactNode, useCallback, useState } from 'react';
import { Text, TextSize } from 'shared/ui/Text/Text';
import { ReactComponent as ArrowIcon } from 'shared/assets/icons/arrow-icon-right.svg';
import cls from './CollapsBoard.module.scss';

interface CollapsBoardProps {
	className?: string;
	title: string;
	children?: ReactNode;
	theme?: CollapsBoardThemes;
  collapsed?: boolean;
}

export enum CollapsBoardThemes {
	BLUE = 'blue',
	GRAY = 'gray',
}

export const CollapsBoard: React.FC<CollapsBoardProps> = (props) => {
  const {
    className, children, title, theme = CollapsBoardThemes.BLUE, collapsed = false,
  } = props;

  const [isCollapsed, setIsCollapsed] = useState<boolean>(collapsed);

  const onToggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <div className={classNames(cls.collapsBoard, {
      [cls.collapsed]: isCollapsed,
    }, [className, cls[theme]])}
    >
      <div className={cls.header} onClick={onToggleCollapsed}>
        <Text title={title} size={TextSize.M} />
        <div className={cls.iconContainer}><ArrowIcon className={cls.icon} /></div>
      </div>
      <div className={cls.controls}>
        <div style={{ minHeight: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
};
