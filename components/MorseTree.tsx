import { type JSX, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { LETTERS_TREE_DATA } from '../constants/MorseData';
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme } = useTheme();
  const svgWidth = width - 40;
  const svgHeight = 280;
  const nodeRadius = 14;
  const verticalSpacing = 50;

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
            stroke={isDotActive ? theme.primary : theme.canvasWarm}
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
            stroke={isDashActive ? theme.primary : theme.canvasWarm}
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
            r={nodeRadius + 9}
            fill="none"
            stroke={theme.primary}
            strokeWidth={1.5}
            opacity={0.4}
          />
        )}
        <Circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill={isActive ? theme.primary : (isPath ? theme.primaryPale : theme.canvas)}
          stroke={isActive || isPath ? theme.primary : theme.canvasWarm}
          strokeWidth={isActive ? 2 : 1}
        />
        <SvgText
          x={x}
          y={y + 5}
          fontSize="15"
          fontWeight="800"
          textAnchor="middle"
          fill={isActive ? theme.canvas : (isPath ? theme.primary : theme.mute)}
        >
          {node.char || (isRoot ? '\u25C9' : '')}
        </SvgText>
      </G>
    );
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 2,
    },
    treeWrapper: {
      backgroundColor: theme.canvas,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.canvasWarm,
      padding: 12,
    },
  }), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.treeWrapper}>
        <Svg width={svgWidth} height={svgHeight}>
          {renderNode(LETTERS_TREE_DATA as MorseNode, svgWidth / 2, 14, 1, '')}
        </Svg>
      </View>
    </View>
  );
}
