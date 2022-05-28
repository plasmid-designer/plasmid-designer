import styled from 'styled-components'

const ModalButton = ({ className, children, ...props }) => {
    return (
        <div className={className} {...props}>
            {children}
        </div>
    )
}

export default styled(ModalButton)`
    display: flex;
    align-items: center;
    background: ${props => props.$primary ? 'hsl(209,75%,45%)' : 'hsl(0,0%,90%)'};
    color: ${props => props.$primary ? 'hsl(0,0%,100%)' : 'hsl(0,0%,0%)'};
    padding: .75rem 1rem;
    border-radius: .25rem;
    box-shadow: 0 .1rem .1rem hsla(0,0%,0%,0.25);
    transition: all .1s ease;
    max-height: calc(100% - 1rem);

    &:hover {
        background: ${props => props.$primary ? 'hsl(209,75%,35%)' : 'hsl(0,0%,80%)'};
        box-shadow: 0 .2rem .25rem hsla(0,0%,0%,0.25);
        user-select: none;
        cursor: pointer;
    }

    &:focus, &:active {
        background: ${props => props.$primary ? 'hsl(209,75%,25%)' : 'hsl(0,0%,70%)'};
        box-shadow: 0 .2rem .25rem hsla(0,0%,0%,0.25);
        user-select: none;
        cursor: pointer;
    }
`
