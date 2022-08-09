import styled from 'styled-components'

type Props = {
    className?: string,
    children: React.ReactNode
}

const Toolbar = ({ className, children }: Props) => {
    return (
        <div className={className}>
            {children}
        </div>
    )
}

export default styled(Toolbar)`
    display: flex;
    height: 2.5rem;
    min-height: 2.5rem;
    align-items: center;
    border-bottom: 1px solid hsl(0,0%,90%);
`
