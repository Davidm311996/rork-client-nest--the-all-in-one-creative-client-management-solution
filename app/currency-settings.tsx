import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Check, Globe } from 'lucide-react-native';
import Header from '@/components/Header';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { useCurrencyStore, CURRENCIES } from '@/store/currencyStore';

export default function CurrencySettingsScreen() {
  const router = useRouter();
  const { selectedCurrency, setCurrency } = useCurrencyStore();
  
  const { updateExchangeRates } = useCurrencyStore();
  
  const handleCurrencySelect = async (currency: typeof CURRENCIES[0]) => {
    setCurrency(currency);
    // Update exchange rates when currency changes
    await updateExchangeRates();
    setTimeout(() => {
      router.back();
    }, 300);
  };
  
  const renderCurrencyItem = (currency: typeof CURRENCIES[0]) => {
    const isSelected = selectedCurrency.code === currency.code;
    
    return (
      <TouchableOpacity
        key={currency.code}
        style={[
          styles.currencyItem,
          isSelected && styles.selectedCurrencyItem
        ]}
        onPress={() => handleCurrencySelect(currency)}
        activeOpacity={0.7}
      >
        <View style={styles.currencyInfo}>
          <View style={styles.currencyHeader}>
            <Text style={styles.currencyFlag}>{currency.flag}</Text>
            <View style={styles.currencyDetails}>
              <Text style={styles.currencyName}>{currency.name}</Text>
              <Text style={styles.currencyCode}>{currency.code} • {currency.symbol}</Text>
            </View>
          </View>
        </View>
        
        {isSelected && (
          <View style={styles.checkContainer}>
            <Check size={20} color={colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Currency" showBackButton />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <Globe size={32} color={colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Select Currency</Text>
          <Text style={styles.headerDescription}>
            Choose your preferred currency for invoices and payments
          </Text>
        </View>
        
        <View style={styles.currenciesContainer}>
          {CURRENCIES.map(renderCurrencyItem)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  currenciesContainer: {
    gap: 2,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCurrencyItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  currencyInfo: {
    flex: 1,
  },
  currencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  currencyDetails: {
    flex: 1,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  currencyCode: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  checkContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});