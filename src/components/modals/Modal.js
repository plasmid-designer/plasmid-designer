import styled from 'styled-components'
import ReactModal from 'react-modal'

const customModalStyle = {
    overlay: {
        backgroundColor: 'hsla(0,0%,0%,.75)',
    },
    content: {
        inset: 0,
        padding: 0,
    }
}

const Modal = ({ className, contentClassName, isOpen, onClose, title, children, footer }) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customModalStyle}
            closeTimeoutMS={100}
            className="PlasmidModalContentWrapper"
        >
            <div className="PlasmidModalContent">
                <div className={className}>
                    <div className="header">
                        <div className="title">{title}</div>
                    </div>
                    <div className='content'>
                        <div className={contentClassName}>
                            {children}
                        </div>
                    </div>
                    {footer && (
                        <div className="footer">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </ReactModal>
    )
}

export default styled(Modal)`
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;

    & .header {
        display: flex;
        align-items: center;
        padding: .75rem 1rem;
        user-select: none;

        & .title {
            flex-grow: 1;
            text-align: center;
        }
    }

    & .content {
        width: 100%;
        padding: 1rem;
        overflow-y: auto;
        flex-grow: 1;

        & > div {
            width: 100%;
            height: 100%;
        }
    }

    & .footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: .5rem 1rem;
        gap: 1rem;
    }
`
