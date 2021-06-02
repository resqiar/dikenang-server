import styled from 'styled-components'

interface Props {
	type: 'button' | 'submit' | 'reset'
	bgColor?: string
	color?: string
	fontSize?: string
	text: string
	width?: string
	height?: string
	border?: string
	textAlign?: string
	borderRadius?: string
	fontWeight?: string
	padding?: string
	margin?: string
	boxShadow?: string
	// hover
	hoverColor?: string
	hoverBg?: string
	hoverBoxShadow?: string
	// mobile
	mobileFontSize?: string
}

export default function Button(props: Props) {
	return (
		<ButtonElement
			type={props.type}
			color={props.color}
			bgColor={props.bgColor}
			fontSize={props.fontSize}
			width={props.width}
			height={props.height}
			border={props.border}
			textAlign={props.textAlign}
			borderRadius={props.borderRadius}
			fontWeight={props.fontWeight}
			padding={props.padding}
			margin={props.margin}
			boxShadow={props.boxShadow}
			// hover
			hoverColor={props.hoverColor}
			hoverBg={props.hoverBg}
			hoverBoxShadow={props.hoverBoxShadow}
			// mobile
			mobileFontSize={props.mobileFontSize}
		>
			{props.text}
		</ButtonElement>
	)
}

const ButtonElement = styled.button<{
	color?: string
	bgColor?: string
	fontSize?: string
	width?: string
	height?: string
	border?: string
	textAlign?: string
	borderRadius?: string
	fontWeight?: string
	padding?: string
	margin?: string
	boxShadow?: string
	// hover
	hoverColor?: string
	hoverBg?: string
	hoverBoxShadow?: string
	// mobile
	mobileFontSize?: string
}>`
	outline: none;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	background-color: ${(props) => props.bgColor || 'transparent'};
	color: ${(props) => props.color || undefined};
	border: ${(props) => props.border || undefined};
	font-size: ${(props) => props.fontSize || 'inherit'};
	text-align: ${(props) => props.textAlign || 'center'};
	border-radius: ${(props) => props.borderRadius || undefined};
	width: ${(props) => props.width || '100%'};
	height: ${(props) => props.height || '100%'};
	font-weight: ${(props) => props.fontWeight || undefined};
	padding: ${(props) => props.padding || undefined};
	margin: ${(props) => props.margin || undefined};
	box-shadow: ${(props) => props.boxShadow || undefined};

	&:hover {
		background: ${(props) => props.hoverBg || undefined};
		box-shadow: ${(props) => props.hoverBoxShadow || undefined};
		color: ${(props) => props.hoverColor || undefined};
	}

	/* How mobile should behave */
	@media (max-width: 600px) {
		font-size: ${(props) => props.mobileFontSize || undefined};
	}
`
