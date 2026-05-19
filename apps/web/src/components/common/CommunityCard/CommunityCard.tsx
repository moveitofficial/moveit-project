import { vars } from '@repo/styles/tokens';
import { RectLabel } from '@repo/ui/RectLabel';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import Image from 'next/image';

import * as styles from './CommunityCard.css';

export default function CommunityCard() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.infoContainer}>
        <RectLabel text="질문" color="blue50" />
        <div className={styles.dateText}>2024.04.18</div>
      </div>
      <div className={styles.titleText}>
        Next.js 14 app router에서 server action 폼처리 어떻게 하시나요?
      </div>
      <div className={styles.contentText}>
        서버 액션으로 form submit 처리하려는데 revalidatePath 타이밍이
        헷갈려서요...서버 액션으로 form submit 처리하려는데 revalidatePath
        타이밍이 헷갈려서요...서버 액션으로 form submit 처리하려는데
        revalidatePath 타이밍이 헷갈려서요...서버 액션으로 form submit
        처리하려는데 revalidatePath 타이밍이 헷갈려서요...서버 액션으로 form
        submit 처리하려는데 revalidatePath 타이밍이 헷갈려서요...
      </div>
      <div className={styles.communityInfoContainer}>
        <div className={styles.userInfoContainer}>
          <Image
            src={'https://picsum.photos/seed/moveit-1/800/1200'}
            alt="profileImage"
            width={16}
            height={16}
            className={styles.ImageContents}
          />
          <div className={styles.userName}>개발하는 조한준</div>
        </div>
        <div className={styles.statsContainer}>
          <div className={styles.statsItem}>
            <MessageCircle
              size={16}
              strokeWidth={3}
              color={vars.color.black300}
            />
            <div>22222</div>
          </div>
          <div className={styles.statsItem}>
            <ThumbsUp size={16} strokeWidth={3} color={vars.color.black300} />
            <div>22222</div>
          </div>
        </div>
      </div>
    </div>
  );
}
