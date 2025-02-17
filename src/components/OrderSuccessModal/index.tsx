import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import useMediaQuery from '../../hooks/useMediaQuery';
import { $CartList, $CheckedCartIdList, $CurrentServerUrl } from '../../recoil/atom';
import Modal from '../Common/Modal';
import styles from './index.module.scss';

interface OrderSuccessModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  orderList: string[];
  deliveryLocation: string;
  finalPrice?: string;
}

function OrderSuccessModal({
  isModalOpen,
  closeModal,
  orderList,
  deliveryLocation,
  finalPrice,
}: OrderSuccessModalProps) {
  const currentServerUrl = useRecoilValue($CurrentServerUrl);
  const setCartList = useSetRecoilState($CartList(currentServerUrl));
  const [checkedCartIdList, setCheckedCartIdList] = useRecoilState($CheckedCartIdList(currentServerUrl));
  const isMobile = useMediaQuery({ maxWidth: 700 });
  const navigate = useNavigate();

  const handleClickNavigate =
    (path: string): React.MouseEventHandler<HTMLButtonElement> =>
    () => {
      navigate(path);
      setCartList(prev => prev.filter(item => !checkedCartIdList.includes(item.id)));
      setCheckedCartIdList([]);
    };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'; // 스크롤 막기
    } else {
      document.body.style.overflow = 'unset'; // 스크롤 다시 허용
    }

    return () => {
      document.body.style.overflow = 'unset'; // 컴포넌트 언마운트 시 복구
    };
  }, [isModalOpen]);

  return (
    <Modal isModalOpen={isModalOpen} closeModal={closeModal} direction="center" useBackDropClose={false}>
      <div className={styles.modal}>
        <img className={styles['success-image']} src="/payments-success.png" alt="결제 성공" />
        <tbody className={styles['payments-information']}>
          <tr>
            <th>주문 상품</th>{' '}
            <th>
              {orderList[0]} 외 {orderList.length - 1}개
            </th>
          </tr>
          <tr>
            <th>배송지</th> <th>{deliveryLocation}</th>
          </tr>
          <tr>
            <th>결제 금액</th> <th>{finalPrice}</th>
          </tr>
        </tbody>
        <div className={styles['modal-button-container']}>
          <button type="button" onClick={handleClickNavigate('/')}>
            쇼핑 {isMobile && <br />}계속하기
          </button>
          <button type="button" onClick={handleClickNavigate('/order')}>
            주문현황 {isMobile && <br />}보기
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default OrderSuccessModal;
