import { CollapsBoard } from 'widgets/CollapsBoard';
import { CommentBlock } from 'widgets/CommentBlock';
import { Comment } from 'entities/Comment';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { useCallback, useState } from 'react';
import { useUserData } from 'shared/lib/hooks/useUserData/useUserData';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { sendComment } from 'pages/ApplicationDetailPage/model/services/sendComment/sendComment';
import cls from './ApplicationDetailComments.module.scss';
import { SendCommentFormData } from '../../model/type/applicationDetail';

interface ApplicationDetailCommentsProps {
  title: string;
  commentList?: Comment[];
  isSawatzkyBlock?: boolean;
  applicationId: string;
}

export const ApplicationDetailComments: React.FC<ApplicationDetailCommentsProps> = (props) => {
  const {
    title, commentList, isSawatzkyBlock = false, applicationId,
  } = props;
  const [text, setText] = useState('');
  const { id } = useUserData();
  const dispatch = useAppDispatch();

  const onSubmitForm = useCallback(() => {
    const formData: SendCommentFormData = {
      creator: id,
      description: text,
      isSawatzky: isSawatzkyBlock,
    };
    setText('');
    dispatch(sendComment({ applicationId, formData }));
  }, [text, isSawatzkyBlock, id, applicationId, dispatch]);

  const { Form } = useForm({
    fields: [
      {
        id: 'descriptions',
        type: FormType.BIG_TEXT,
        defaultValue: text,
        value: text,
        placeholder: 'Введите комментарий',
        onChange: (value: string) => setText(value),
        rules: {
          required: true,
        },
        otherProps: {
          className: cls.textarea,
        },
      },
    ].filter((field) => field !== null),
    onSubmit: onSubmitForm,
    submitTitle: 'Добавить комментарий',
  });

  return (
    <CollapsBoard title={title} className={cls.collapse} collapsed>
      <div className={cls.comments}>
        {
          commentList && commentList.length > 0
            ? commentList.map((comment) => (
              <CommentBlock key={comment.id} data={comment} />
            ))
            : <p>Комментариев нет</p>
        }

      </div>
      <div className={cls.addComm}>
        {
          Form
        }
        {/* <Textarea className={cls.textarea} placeholder="Введите комментарий" rows={4} /> */}
        {/* <Button className={cls.btn}>Добавить комментарий</Button> */}
      </div>
    </CollapsBoard>
  );
};
