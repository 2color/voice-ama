import styled from 'styled-components'
import defaultTheme from '~/components/Theme'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: ${defaultTheme.space[3]};
  grid-auto-rows: auto;
  width: 100%;
  max-width: ${defaultTheme.breakpoints[0]};
  padding: 0 ${defaultTheme.space[3]};
  margin-top: ${defaultTheme.space[5]};

  @media (max-width: ${defaultTheme.breakpoints[2]}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${defaultTheme.breakpoints[4]}) {
    grid-template-columns: 1fr;
    padding: 0;
  }
`