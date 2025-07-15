import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Palette, Upload, Eye, Save, Image as ImageIcon } from 'lucide-react-native';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import typography from '@/constants/typography';

export default function BrandingSettingsScreen() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('Your Studio Name');
  const [tagline, setTagline] = useState('Professional Creative Services');
  const [primaryColor, setPrimaryColor] = useState('#4B3E8E');
  const [secondaryColor, setSecondaryColor] = useState('#C6BFF3');
  const [logoUrl, setLogoUrl] = useState('');
  const [showLogoOnInvoices, setShowLogoOnInvoices] = useState(true);
  const [showLogoOnContracts, setShowLogoOnContracts] = useState(true);
  const [customFooter, setCustomFooter] = useState('Thank you for choosing our services!');
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);

  const handleSave = () => {
    Alert.alert('Success', 'Branding settings saved successfully!');
  };

  const handlePreview = () => {
    Alert.alert('Preview', 'Opening preview of branded documents...');
  };

  const colorPresets = [
    { name: 'Deep Purple', primary: '#4B3E8E', secondary: '#C6BFF3' },
    { name: 'Dark Navy', primary: '#212443', secondary: '#8B9DC3' },
    { name: 'Ocean Blue', primary: '#2563EB', secondary: '#93C5FD' },
    { name: 'Forest Green', primary: '#059669', secondary: '#6EE7B7' },
    { name: 'Sunset Orange', primary: '#EA580C', secondary: '#FED7AA' },
    { name: 'Rose Pink', primary: '#E11D48', secondary: '#FECACA' },
    { name: 'Midnight Black', primary: '#1F2937', secondary: '#9CA3AF' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Branding" 
        showBackButton 
        rightElement={
          <Button
            title="Save"
            onPress={handleSave}
            variant="primary"
            size="small"
            leftIcon={<Save size={16} color={colors.text.inverse} />}
          />
        }
      />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Company Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Company Information</Text>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Company Name</Text>
            <TextInput
              style={styles.fieldInput}
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Enter your company name"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Tagline</Text>
            <TextInput
              style={styles.fieldInput}
              value={tagline}
              onChangeText={setTagline}
              placeholder="Enter your company tagline"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </Card>

        {/* Logo Settings */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Logo</Text>
          
          <View style={styles.logoSection}>
            <View style={styles.logoPreview}>
              {logoUrl ? (
                <Text style={styles.logoPlaceholder}>Logo Preview</Text>
              ) : (
                <ImageIcon size={32} color={colors.text.tertiary} />
              )}
            </View>
            
            <View style={styles.logoActions}>
              <Button
                title="Upload Logo"
                variant="outline"
                size="small"
                leftIcon={<Upload size={16} color={colors.primary} />}
                onPress={() => Alert.alert('Upload', 'Logo upload functionality')}
              />
              {logoUrl && (
                <Button
                  title="Remove"
                  variant="outline"
                  size="small"
                  onPress={() => setLogoUrl('')}
                />
              )}
            </View>
          </View>

          <View style={styles.toggleSection}>
            <View style={styles.toggleItem}>
              <Text style={styles.toggleLabel}>Show logo on invoices</Text>
              <Switch
                value={showLogoOnInvoices}
                onValueChange={setShowLogoOnInvoices}
                trackColor={{ false: colors.inactive, true: colors.primary }}
                thumbColor={colors.text.primary}
              />
            </View>
            
            <View style={styles.toggleItem}>
              <Text style={styles.toggleLabel}>Show logo on contracts</Text>
              <Switch
                value={showLogoOnContracts}
                onValueChange={setShowLogoOnContracts}
                trackColor={{ false: colors.inactive, true: colors.primary }}
                thumbColor={colors.text.primary}
              />
            </View>
          </View>
        </Card>

        {/* Color Scheme */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Color Scheme</Text>
          
          <View style={styles.colorInputs}>
            <View style={styles.colorField}>
              <Text style={styles.fieldLabel}>Primary Color</Text>
              <View style={styles.colorInputContainer}>
                <View style={[styles.colorPreview, { backgroundColor: primaryColor }]} />
                <TextInput
                  style={styles.colorInput}
                  value={primaryColor}
                  onChangeText={setPrimaryColor}
                  placeholder="#4B3E8E"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>
            </View>
            
            <View style={styles.colorField}>
              <Text style={styles.fieldLabel}>Secondary Color</Text>
              <View style={styles.colorInputContainer}>
                <View style={[styles.colorPreview, { backgroundColor: secondaryColor }]} />
                <TextInput
                  style={styles.colorInput}
                  value={secondaryColor}
                  onChangeText={setSecondaryColor}
                  placeholder="#C6BFF3"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>
            </View>
          </View>

          <Text style={styles.presetsTitle}>Color Presets</Text>
          <View style={styles.colorPresets}>
            {colorPresets.map((preset, index) => (
              <TouchableOpacity
                key={index}
                style={styles.colorPreset}
                onPress={() => {
                  setPrimaryColor(preset.primary);
                  setSecondaryColor(preset.secondary);
                }}
              >
                <View style={[styles.presetPrimary, { backgroundColor: preset.primary }]} />
                <View style={[styles.presetSecondary, { backgroundColor: preset.secondary }]} />
                <Text style={styles.presetName}>{preset.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Document Customization */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Document Customization</Text>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Invoice Header Text</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="Custom text for invoice headers"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Contract Header Text</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="Custom text for contract headers"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Footer Text</Text>
            <TextInput
              style={[styles.fieldInput, styles.textArea]}
              value={customFooter}
              onChangeText={setCustomFooter}
              placeholder="Enter custom footer text for documents"
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={3}
            />
          </View>
        </Card>

        {/* Advanced Branding */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced Branding</Text>
          
          <View style={styles.toggleItem}>
            <View style={styles.toggleContent}>
              <Text style={styles.toggleLabel}>Enable watermark on drafts</Text>
              <Text style={styles.toggleDescription}>
                Add a watermark to draft invoices and contracts
              </Text>
            </View>
            <Switch
              value={watermarkEnabled}
              onValueChange={setWatermarkEnabled}
              trackColor={{ false: colors.inactive, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Email Signature</Text>
            <TextInput
              style={[styles.fieldInput, styles.textArea]}
              placeholder="Custom email signature for client communications"
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Website URL</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="https://yourstudio.com"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Social Media Links</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="Instagram, Twitter, LinkedIn URLs"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </Card>

        {/* Preview Button */}
        <Button
          title="Preview Branding"
          variant="outline"
          onPress={handlePreview}
          leftIcon={<Eye size={20} color={colors.primary} />}
          style={styles.previewButton}
        />
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoPreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  logoPlaceholder: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  logoActions: {
    flex: 1,
    gap: 8,
  },
  toggleSection: {
    gap: 12,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleContent: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 2,
  },
  toggleDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  colorInputs: {
    gap: 16,
    marginBottom: 20,
  },
  colorField: {
    gap: 8,
  },
  colorInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  presetsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  colorPresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorPreset: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 12,
  },
  presetPrimary: {
    width: 32,
    height: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  presetSecondary: {
    width: 32,
    height: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  presetName: {
    fontSize: 10,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
  },
  previewButton: {
    marginTop: 20,
  },
});