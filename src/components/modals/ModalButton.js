import styled from 'styled-components'

const Theme = {
    primary: {
        bg: {
            default: 'hsl(209,75%,45%)',
            hover: 'hsl(209,75%,35%)',
            focus: 'hsl(209,75%,25%)',
        },
        fg: 'hsl(0,0%,100%)',
    },
    destructive: {
        bg: {
            default: 'hsl(0,60%,45%)',
            hover: 'hsl(0,60%,35%)',
            focus: 'hsl(0,60%,25%)',
        },
        fg: 'hsl(0,0%,100%)',
    },
    default: {
        bg: {
            default: 'hsl(0,0%,90%)',
            hover: 'hsl(0,0%,80%)',
            focus: 'hsl(0,0%,70%)',
        },
        fg: 'hsl(0,0%,0%)',
    },
}

const fg = (props, sym) => {
    const key = props.$primary ? 'primary' : props.$destructive ? 'destructive' : 'default'
    return Theme[key].fg?.[sym ?? 'default'] ?? Theme[key].fg
}

const bg = (props, sym) => {
    const key = props.$primary ? 'primary' : props.$destructive ? 'destructive' : 'default'
    return Theme[key].bg?.[sym ?? 'default'] ?? Theme[key].bg
}

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
    background: ${props => bg(props)};
    color: ${props => fg(props)};
    padding: .75rem 1rem;
    border-radius: .25rem;
    box-shadow: 0 .1rem .1rem hsla(0,0%,0%,0.25);
    transition: all .1s ease;
    max-height: calc(100% - 1rem);

    &:hover {
        background: ${props => bg(props, 'hover')};
        box-shadow: 0 .2rem .25rem hsla(0,0%,0%,0.25);
        user-select: none;
        cursor: pointer;
    }

    &:focus, &:active {
        background: ${props => bg(props, 'focus')};
        box-shadow: 0 .2rem .25rem hsla(0,0%,0%,0.25);
        user-select: none;
        cursor: pointer;
    }
`
