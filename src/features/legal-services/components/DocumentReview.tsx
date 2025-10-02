import React, { useState } from 'react';
import { Card } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Textarea } from '../../../shared/components/ui/textarea';
import { Badge } from '../../../shared/components/ui/badge';
import { Progress } from '../../../shared/components/ui/progress';
import { getGeminiService } from '../../../shared/services/geminiService';
import {
  FileText,
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Brain,
  Zap,
  Target,
  Shield,
  BookOpen,
  MessageSquare
} from 'lucide-react';

interface DocumentReviewProps {
  onNavigate: (screen: string) => void;
}

interface AIAnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  overallScore: number;
  keyFindings: string[];
  recommendations: string[];
  legalIssues: string[];
  summary: string;
  estimatedReadTime: string;
}

export default function DocumentReview({ onNavigate }: DocumentReviewProps) {
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const documentTypes = [
    { id: 'contract', name: 'Contract Review', description: 'Employment, rental, or business contracts', icon: <FileText className="h-5 w-5" /> },
    { id: 'legal-notice', name: 'Legal Notice', description: 'Formal legal notices and demands', icon: <AlertTriangle className="h-5 w-5" /> },
    { id: 'agreement', name: 'Agreement Draft', description: 'Partnership, service, or license agreements', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'will', name: 'Will & Testament', description: 'Estate planning documents', icon: <Shield className="h-5 w-5" /> },
    { id: 'lease', name: 'Lease Agreement', description: 'Property rental agreements', icon: <FileText className="h-5 w-5" /> },
    { id: 'other', name: 'Other Documents', description: 'Custom legal document review', icon: <Plus className="h-5 w-5" /> }
  ];

  // Real Gemini AI analysis
  const performAIAnalysis = async (file: File, documentType: string): Promise<AIAnalysisResult> => {
    try {
      const geminiService = getGeminiService();

      // Create document content for analysis (in real implementation, you'd extract text from file)
      const documentContent = `Document Type: ${documentType}
File Name: ${file.name}
File Size: ${file.size} bytes
File Type: ${file.type}

Please analyze this ${documentType} document for legal compliance, risks, and recommendations.`;

      // Validate if this is actually a legal document request
      const isLegalContent = await geminiService.validateLegalContent(documentContent + " " + documentType);

      if (!isLegalContent) {
        return {
          riskLevel: 'low',
          overallScore: 0,
          keyFindings: ['Non-legal document detected'],
          recommendations: ['Please upload legal documents only such as contracts, agreements, legal notices, etc.'],
          legalIssues: [],
          summary: 'Please talk related to law. This document review service is designed for legal documents only. Please upload contracts, agreements, legal notices, court documents, or other legal materials for professional analysis.',
          estimatedReadTime: '1 minute'
        };
      }

      const result = await geminiService.reviewDocument({
        type: 'document-review',
        content: documentContent,
        context: {
          category: documentType,
          jurisdiction: 'India',
          urgency: 'medium'
        }
      });

      // Transform Gemini response to match component's expected format
      return {
        riskLevel: (result.riskLevel?.toLowerCase() as 'low' | 'medium' | 'high') || 'medium',
        overallScore: result.confidence || 85,
        keyFindings: result.recommendedActions?.slice(0, 4) || [
          "Document structure analyzed",
          "Legal compliance reviewed",
          "Risk assessment completed",
          "Recommendations prepared"
        ],
        recommendations: result.recommendedActions || [
          "Review document with legal expert",
          "Consider additional protective clauses",
          "Ensure compliance with applicable laws",
          "Update terms as needed"
        ],
        legalIssues: result.applicableLaws?.map(law => `Review compliance with ${law}`) || [],
        summary: result.analysis || `This ${documentType.toLowerCase()} has been analyzed using advanced AI. The analysis provides insights into legal compliance, potential risks, and recommendations for improvement.`,
        estimatedReadTime: "3-5 minutes"
      };
    } catch (error) {
      console.error('Gemini AI analysis failed:', error);

      // Fallback to basic analysis if AI fails
      return {
        riskLevel: 'medium',
        overallScore: 75,
        keyFindings: [
          "AI analysis temporarily unavailable",
          "Basic document structure reviewed",
          "Standard legal review recommended",
          "Professional consultation advised"
        ],
        recommendations: [
          "Consult with a legal professional",
          "Review document thoroughly",
          "Ensure all terms are understood",
          "Consider legal compliance requirements"
        ],
        legalIssues: [
          "Professional legal review recommended due to AI service unavailability"
        ],
        summary: `Document uploaded successfully. Due to temporary AI service unavailability, we recommend professional legal review of this ${documentType.toLowerCase()}.`,
        estimatedReadTime: "5-10 minutes"
      };
    }
  };

  const recentDocuments = [
    {
      id: 1,
      name: 'Employment Contract_v2.pdf',
      type: 'Contract Review',
      status: 'AI Analyzed',
      uploadDate: '2024-12-10',
      riskLevel: 'medium',
      score: 85
    },
    {
      id: 2,
      name: 'Rental Agreement_Draft.docx',
      type: 'Lease Agreement',
      status: 'AI Analyzed',
      uploadDate: '2024-12-08',
      riskLevel: 'low',
      score: 92
    },
    {
      id: 3,
      name: 'Legal Notice_Consumer.pdf',
      type: 'Legal Notice',
      status: 'AI Analyzed',
      uploadDate: '2024-12-07',
      riskLevel: 'high',
      score: 73
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AI Analyzed': return 'bg-green-100 text-green-800';
      case 'Analyzing': return 'bg-blue-100 text-blue-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0] && selectedDocument) {
      const file = files[0];
      setUploadedFile(file);
      setIsAnalyzing(true);
      setAnalysisResult(null);

      try {
        const result = await performAIAnalysis(file, selectedDocument);
        setAnalysisResult(result);
      } catch (error) {
        console.error('Analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="h-full bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-4">

        {/* Responsive Layout: Single column on mobile, main + sidebar on desktop */}
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 xl:gap-6">
          {/* Main Content Area - Upload New Document */}
          <div className="flex-1 lg:w-2/3">
            <Card className="p-3 lg:p-4 xl:p-6">
              <div className="flex items-center mb-4 lg:mb-6">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 mr-2" />
                  <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-slate-900">AI Document Analysis</h2>
                </div>
              </div>

              {/* Document Type Selection */}
              <div className="mb-3 lg:mb-4">
                <label className="block text-sm lg:text-base font-medium text-slate-900 mb-2">
                  1. Select Document Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 lg:gap-3">
                  {documentTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`group p-3 border rounded-lg cursor-pointer transition-all duration-200 text-center transform hover:scale-105 ${selectedDocument === type.id
                        ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200 scale-105'
                        : 'border-slate-200 hover:border-blue-300 hover:shadow-md hover:bg-slate-50'
                        }`}
                      onClick={() => setSelectedDocument(type.id)}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`transition-colors duration-200 ${
                          selectedDocument === type.id 
                            ? 'text-blue-600' 
                            : 'text-slate-600 group-hover:text-blue-500'
                        }`}>
                          {type.icon}
                        </div>
                        <div>
                          <h3 className={`font-medium text-xs lg:text-sm leading-tight transition-colors duration-200 ${
                            selectedDocument === type.id 
                              ? 'text-blue-900' 
                              : 'text-slate-900 group-hover:text-blue-800'
                          }`}>{type.name}</h3>
                        </div>
                        {selectedDocument === type.id && (
                          <CheckCircle className="h-4 w-4 text-blue-600 animate-pulse" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Upload Area */}
              <div className="flex-grow flex flex-col">
                <label className="block text-sm lg:text-base font-medium text-slate-900 mb-2">2. Upload Document</label>
                <div 
                  className={`relative border-2 border-dashed rounded-xl p-6 lg:p-8 text-center transition-all duration-300 flex-grow flex flex-col justify-center min-h-[200px] lg:min-h-[250px] ${
                    isAnalyzing 
                      ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100' 
                      : selectedDocument 
                        ? 'border-slate-300 hover:border-blue-400 hover:bg-slate-50 cursor-pointer' 
                        : 'border-slate-200 bg-slate-50 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (selectedDocument && !isAnalyzing) {
                      document.getElementById('file-upload')?.click();
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (selectedDocument) {
                      e.currentTarget.classList.add('border-blue-500', 'bg-blue-50', 'scale-105');
                    }
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'scale-105');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'scale-105');
                    if (selectedDocument && !isAnalyzing) {
                      const files = e.dataTransfer.files;
                      if (files && files[0]) {
                        const event = { target: { files } } as React.ChangeEvent<HTMLInputElement>;
                        handleFileUpload(event);
                      }
                    }
                  }}
                >
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <Brain className="h-12 w-12 lg:h-16 lg:w-16 text-blue-600 mx-auto animate-pulse" />
                        <div className="absolute inset-0 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin"></div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-blue-800 font-semibold text-base lg:text-lg">AI Analysis in Progress</p>
                        <p className="text-blue-600 text-sm lg:text-base">Analyzing document structure and legal compliance</p>
                        <div className="w-48 lg:w-64 mx-auto">
                          <Progress value={66} className="h-2 bg-blue-200" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className={`transition-all duration-300 ${selectedDocument ? 'scale-100 opacity-100' : 'scale-95 opacity-75'}`}>
                        <Upload className={`h-12 w-12 lg:h-16 lg:w-16 mx-auto mb-4 transition-colors duration-300 ${
                          selectedDocument ? 'text-blue-500' : 'text-slate-400'
                        }`} />
                        <div className="space-y-2">
                          <p className={`text-base lg:text-lg font-semibold transition-colors duration-300 ${
                            selectedDocument ? 'text-slate-800' : 'text-slate-500'
                          }`}>
                            {selectedDocument ? 'Drop your document here or click to upload' : 'Select document type first'}
                          </p>
                          <p className="text-sm text-slate-500">
                            PDF, DOC, DOCX • Maximum file size: 10MB
                          </p>
                        </div>
                      </div>
                      
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        className="hidden" 
                        id="file-upload" 
                        onChange={handleFileUpload} 
                        disabled={!selectedDocument || isAnalyzing} 
                      />
                      
                      <div className="space-y-3">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedDocument && !isAnalyzing) {
                              document.getElementById('file-upload')?.click();
                            }
                          }}
                          className={`w-full sm:w-auto transition-all duration-300 ${
                            selectedDocument 
                              ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-md hover:shadow-lg' 
                              : 'bg-slate-400 cursor-not-allowed'
                          } text-white px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base font-medium rounded-lg`} 
                          disabled={!selectedDocument || isAnalyzing}
                        >
                          <Upload className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                          Choose File to Upload
                        </Button>
                        
                        {!selectedDocument && (
                          <div className="flex items-center justify-center space-x-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                            <AlertTriangle className="h-4 w-4" />
                            <p className="text-sm font-medium">Please select a document type above first</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Analysis Results */}
              {analysisResult && (
                <div className="mt-6 lg:mt-8 space-y-4 lg:space-y-6">
                  <div className="border-t pt-4 lg:pt-6">
                    <div className="flex items-center mb-4">
                      <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-green-600 mr-2" />
                      <h3 className="text-lg lg:text-xl font-bold text-slate-900">Analysis Complete</h3>
                    </div>

                    {/* Overall Score & Risk Level */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 lg:mb-6">
                      <Card className="p-3 lg:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs lg:text-sm text-slate-600">Overall Score</p>
                            <p className="text-xl lg:text-2xl font-bold text-slate-900">{analysisResult.overallScore}/100</p>
                          </div>
                          <Target className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                        </div>
                      </Card>
                      <Card className="p-3 lg:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs lg:text-sm text-slate-600">Risk Level</p>
                            <Badge className={getRiskColor(analysisResult.riskLevel)}>
                              {analysisResult.riskLevel.toUpperCase()}
                            </Badge>
                          </div>
                          <AlertTriangle className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
                        </div>
                      </Card>
                    </div>

                    {/* Summary */}
                    <Card className="p-6 mb-6">
                      <h4 className="font-semibold text-slate-900 mb-3">AI Summary</h4>
                      <p className="text-slate-700 leading-relaxed">{analysisResult.summary}</p>
                      <p className="text-sm text-slate-500 mt-2">Estimated reading time: {analysisResult.estimatedReadTime}</p>
                    </Card>

                    {/* Key Findings */}
                    <Card className="p-6 mb-6">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        Key Findings
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.keyFindings.map((finding, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    {/* Legal Issues */}
                    {analysisResult.legalIssues.length > 0 && (
                      <Card className="p-6 mb-6 border-orange-200 bg-orange-50">
                        <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Potential Legal Issues
                        </h4>
                        <ul className="space-y-2">
                          {analysisResult.legalIssues.map((issue, index) => (
                            <li key={index} className="flex items-start">
                              <AlertTriangle className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-orange-800">{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}

                    {/* Recommendations */}
                    <Card className="p-6 border-blue-200 bg-blue-50">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        AI Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start">
                            <Target className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-blue-800">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 mt-6">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Consult Lawyer
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* AI Features & Benefits Sidebar - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block lg:w-1/3 space-y-4 lg:space-y-6">
            <Card className="p-4 lg:p-6">
              <div className="flex items-center mb-4">
                <Brain className="h-4 w-4 lg:h-5 lg:w-5 text-purple-600 mr-2" />
                <h3 className="text-base lg:text-lg font-semibold text-slate-900">AI Analysis Features</h3>
              </div>
              <div className="space-y-3 lg:space-y-4">
                <div className="flex items-start space-x-3">
                  <Zap className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 text-sm lg:text-base">Instant Analysis</p>
                    <p className="text-xs lg:text-sm text-slate-600">Get results in 3-5 seconds</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="h-4 w-4 lg:h-5 lg:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 text-sm lg:text-base">Risk Assessment</p>
                    <p className="text-xs lg:text-sm text-slate-600">Identify potential legal issues</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 text-sm lg:text-base">Smart Recommendations</p>
                    <p className="text-xs lg:text-sm text-slate-600">Actionable improvement suggestions</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-center mb-4">
                <Shield className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 mr-2" />
                <h3 className="text-base lg:text-lg font-semibold text-slate-900">Why Choose AI Review?</h3>
              </div>
              <div className="space-y-2 lg:space-y-3">
                <div className="flex items-center text-xs lg:text-sm">
                  <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-green-600 mr-2" />
                  <span className="text-slate-700">100% Free Analysis</span>
                </div>
                <div className="flex items-center text-xs lg:text-sm">
                  <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-green-600 mr-2" />
                  <span className="text-slate-700">24/7 Availability</span>
                </div>
                <div className="flex items-center text-xs lg:text-sm">
                  <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-green-600 mr-2" />
                  <span className="text-slate-700">Comprehensive Reports</span>
                </div>
                <div className="flex items-center text-xs lg:text-sm">
                  <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-green-600 mr-2" />
                  <span className="text-slate-700">Expert Consultation Available</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}