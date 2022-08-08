import styled from 'styled-components'
import Icon from './Icon'

type Props = {
    className?: string,
}

const Header = ({ className }: Props) => {
    return (
        <header className={className}>
            <div className="content">
                <div className="icon">
                    <Icon />
                </div>
                Plasmid Designer
            </div>
        </header>
    )
}

export default styled(Header)`
    display: flex;
    flex-direction: row;
    align-items: center;
    background: hsl(0,0%,95%);
    user-select: none;
    padding-top: .75rem;
    height: calc(2rem + .75rem);

    & img {
        object-fit: scale-down;
    }

    & .content {
        display: flex;
        align-items: center;
        height: 24px;

        & .icon {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 24px;
            width: calc(24px + 1.5rem);

            & > svg {
                width: 24px;
                height: 24px;
            }
        }
    }
`
