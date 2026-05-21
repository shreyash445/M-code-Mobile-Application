import { type JSX } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { THEME, LETTERS_TREE_DATA } from '../constants/MorseData';

const { width } = Dimensions.get('window');

interface MorseNode {
  char: string;
  dot?: MorseNode;
  dash?: MorseNode;
}

interface MorseTreeProps {
  currentPath: string;
}

export default function MorseTree({ currentPath }: MorseTreeProps) {
  const svgWidth = width - 40;
  const svgHeight = 130;
  const nodeRadius = 9;
  const verticalSpacing = 28;

  const renderNode = (node: MorseNode, x: number, y: number, level: number, path: string) => {
    const isActive = currentPath === path;
    const isPath = currentPath.startsWith(path) && path !== '';
    const isRoot = path === '';

    const children: JSX.Element[] = [];
    const spread = svgWidth / Math.pow(2, level + 1);

    if (node.dot) {
      const dotPath = path + '.';
      const childX = x - spread;
      const childY = y + verticalSpacing;
      const isDotActive = currentPath.startsWith(dotPath);

      children.push(
        <G key={dotPath}>
          <Line
            x1={x}
            y1={y + nodeRadius}
            x2={childX}
            y2={childY - nodeRadius}
            stroke={isDotActive ? THEME.primary : THEME.canvasWarm}
            strokeWidth={isDotActive ? 2 : 1}
          />
          {renderNode(node.dot, childX, childY, level + 1, dotPath)}
        </G>
      );
    }

    if (node.dash) {
      const dashPath = path + '-';
      const childX = x + spread;
      const childY = y + verticalSpacing;
      const isDashActive = currentPath.startsWith(dashPath);

      children.push(
        <G key={dashPath}>
          <Line
            x1={x}
            y1={y + nodeRadius}
            x2={childX}
            y2={childY - nodeRadius}
            stroke={isDashActive ? THEME.primary : THEME.canvasWarm}
            strokeWidth={isDashActive ? 2 : 1}
          />
          {renderNode(node.dash, childX, childY, level + 1, dashPath)}
        </G>
      );
    }

    return (
      <G key={path}>
        {children}
        {isActive && (
          <Circle
            cx={x}
            cy={y}
            r={nodeRadius + 7}
            fill="none"
            stroke={THEME.primary}
            strokeWidth={1.5}
            opacity={0.4}
          />
        )}
        <Circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill={isActive ? THEME.primary : (isPath ? THEME.primaryPale : THEME.canvas)}
          stroke={isActive || isPath ? THEME.primary : THEME.canvasWarm}
          strokeWidth={isActive ? 2 : 1}
        />
        <SvgText
          x={x}
          y={y + 4}
          fontSize="11"
          fontWeight="800"
          textAnchor="middle"
          fill={isActive ? THEME.canvas : (isPath ? THEME.primary : THEME.mute)}
        >
          {node.char || (isRoot ? '\u25C9' : '')}
        </SvgText>
      </G>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.treeWrapper}>
        <Svg width={svgWidth} height={svgHeight}>
          {renderNode(LETTERS_TREE_DATA as MorseNode, svgWidth / 2, 16, 1, '')}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  treeWrapper: {
    backgroundColor: THEME.canvas,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.canvasWarm,
    padding: 8,
  },
});