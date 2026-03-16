import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { PassengerStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { colors, spacing, fontSizes, borderRadius } from '../../theme';
import { mockSubmitRating } from '../../stub/mockApi';

type Props = {
  navigation: NativeStackNavigationProp<PassengerStackParamList, 'Rating'>;
  route: RouteProp<PassengerStackParamList, 'Rating'>;
};

const COMPLIMENTS = ['Ponctuel', 'Très propre', 'Conduite douce', 'Sympa', 'Professionnel', 'Bonne musique'];

export const RatingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { driverName, driverId } = route.params;
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleCompliment = (c: string) => {
    setSelected((s) => s.includes(c) ? s.filter((x) => x !== c) : [...s, c]);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Erreur', 'Veuillez attribuer une note');
      return;
    }
    setSubmitting(true);
    try {
      await mockSubmitRating(driverId, rating, comment);
      navigation.popToTop();
    } finally {
      setSubmitting(false);
    }
  };

  const stars = hovered || rating;

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⭐</Text>
      <Text style={styles.title}>Comment s'est passé votre course ?</Text>
      <Text style={styles.driverName}>Avec {driverName}</Text>

      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setRating(s)}
            onPressIn={() => setHovered(s)}
            onPressOut={() => setHovered(0)}
          >
            <Text style={[styles.star, s <= stars && styles.starFilled]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>

      {rating > 0 && (
        <Text style={styles.ratingLabel}>
          {['', 'Mauvais', 'Passable', 'Bien', 'Très bien', 'Excellent !'][rating]}
        </Text>
      )}

      {rating >= 4 && (
        <>
          <Text style={styles.complimentsTitle}>Qu'avez-vous apprécié ?</Text>
          <View style={styles.compliments}>
            {COMPLIMENTS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, selected.includes(c) && styles.chipSelected]}
                onPress={() => toggleCompliment(c)}
              >
                <Text style={[styles.chipText, selected.includes(c) && styles.chipTextSelected]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <Text style={styles.commentLabel}>Commentaire (optionnel)</Text>
      <TextInput
        style={styles.commentInput}
        value={comment}
        onChangeText={setComment}
        placeholder="Laissez un commentaire..."
        multiline
        numberOfLines={3}
        placeholderTextColor={colors.gray}
      />

      <Button
        title="Envoyer mon avis"
        onPress={handleSubmit}
        loading={submitting}
        size="lg"
        fullWidth
        style={styles.submitBtn}
      />
      <TouchableOpacity onPress={() => navigation.popToTop()}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    alignItems: 'center',
    paddingTop: 60,
  },
  emoji: { fontSize: 64 },
  title: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text, textAlign: 'center', marginTop: spacing.md },
  driverName: { fontSize: fontSizes.md, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.xl },
  starsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  star: { fontSize: 48, color: colors.border },
  starFilled: { color: colors.gold },
  ratingLabel: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.lg },
  complimentsTitle: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text, alignSelf: 'flex-start', marginBottom: spacing.sm },
  compliments: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg, alignSelf: 'flex-start' },
  chip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.white,
  },
  chipSelected: { borderColor: colors.gold, backgroundColor: '#FFF8E1' },
  chipText: { fontSize: fontSizes.sm, color: colors.text },
  chipTextSelected: { color: '#F57F17', fontWeight: '600' },
  commentLabel: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text, alignSelf: 'flex-start', marginBottom: spacing.xs },
  commentInput: {
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  submitBtn: { width: '100%' },
  skipText: { color: colors.gray, fontSize: fontSizes.md, marginTop: spacing.md },
});
