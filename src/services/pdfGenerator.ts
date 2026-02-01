import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'node:fs';
import path from 'node:path';

/**
 * PDF Generator Service
 * Creates professional PDF resumes from resume data
 */
export class PDFGenerator {
  /**
   * Generate a PDF resume from HTML content
   * Uses pdf-lib to create a structured PDF from resume data
   */
  static async generatePDFFromHTML(htmlContent: string): Promise<Buffer> {
    try {
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([612, 792]); // Standard letter size
      
      const fontSize = 12;
      let yPosition = 750;
      
      const textContent = this.stripHTML(htmlContent);
      const lines = textContent.split('\n');
      
      lines.forEach((line: string) => {
        if (yPosition < 50) {
          yPosition = 750;
          page = pdfDoc.addPage([612, 792]);
        }
        
        if (line.trim()) {
          const isHeading = line === line.toUpperCase() && line.length > 3;
          const drawSize = isHeading ? 14 : fontSize;
          
          page.drawText(line.substring(0, 100), {
            x: 50,
            y: yPosition,
            size: drawSize,
            color: rgb(0, 0, 0),
            maxWidth: 512,
          });
          
          yPosition -= drawSize + (isHeading ? 5 : 0);
        }
      });
      
      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch (error: any) {
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }

  /**
   * Generate PDF from structured resume data
   */
  static async generatePDFFromResumeData(resumeData: any): Promise<Buffer> {
    try {
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([612, 792]); // Standard letter size
      
      const margins = { top: 50, bottom: 50, left: 50, right: 50 };
      let yPosition = 792 - margins.top;
      
      const fontSize = 11;
      const sectionTitleSize = 13;
      const nameSize = 18;
      const sectionSpacing = 12;
      
      const drawText = (text: string, size: number, _isBold: boolean = false, spacing: number = 0) => {
        if (yPosition < margins.bottom + 20) {
          yPosition = 792 - margins.top;
          page = pdfDoc.addPage([612, 792]);
        }
        
        page.drawText(text.substring(0, 90), {
          x: margins.left,
          y: yPosition,
          size,
          color: rgb(0, 0, 0),
        });
        
        yPosition -= size + spacing;
      };
      
      const drawLine = () => {
        if (yPosition < margins.bottom + 20) {
          yPosition = 792 - margins.top;
          page = pdfDoc.addPage([612, 792]);
        }
        
        page.drawLine({
          start: { x: margins.left, y: yPosition },
          end: { x: 612 - margins.right, y: yPosition },
          thickness: 0.5,
          color: rgb(0, 0, 0),
        });
        
        yPosition -= 8;
      };
      
      const fullName = resumeData.personalInfo?.fullName || 'Your Name';
      drawText(fullName, nameSize, true);
      
      const contactInfo = [];
      if (resumeData.personalInfo?.email) contactInfo.push(resumeData.personalInfo.email);
      if (resumeData.personalInfo?.phone) contactInfo.push(resumeData.personalInfo.phone);
      if (resumeData.personalInfo?.github) contactInfo.push(resumeData.personalInfo.github);
      if (resumeData.personalInfo?.linkedin) contactInfo.push(resumeData.personalInfo.linkedin);
      
      drawText(contactInfo.join(' | '), fontSize - 1);
      yPosition -= sectionSpacing;
      
      if (resumeData.objective?.course || resumeData.objective?.specialization) {
        drawLine();
        drawText('OBJECTIVE', sectionTitleSize, true, 4);
        
        let objectiveText = `Pursuing ${resumeData.objective.course || 'Master\'s degree'}`;
        if (resumeData.objective.specialization) {
          objectiveText += ` with specialization in ${resumeData.objective.specialization}`;
        }
        drawText(objectiveText, fontSize);
        yPosition -= sectionSpacing;
      }
      
      if (resumeData.education?.degree) {
        drawLine();
        drawText('ACADEMIC QUALIFICATION', sectionTitleSize, true, 4);
        
        const degreeInfo = `${resumeData.education.degree} in ${resumeData.education.subject || 'Computer Science'}`;
        drawText(degreeInfo, fontSize);
        
        if (resumeData.education.university) {
          drawText(resumeData.education.university, fontSize - 1);
        }
        
        if (resumeData.education.gpa) {
          drawText(`GPA: ${resumeData.education.gpa}`, fontSize - 1);
        }
        
        if (resumeData.education.duration) {
          drawText(resumeData.education.duration, fontSize - 1);
        }
        
        yPosition -= sectionSpacing;
      }
      
      if (resumeData.workExperience && resumeData.workExperience.length > 0) {
        drawLine();
        drawText('WORK EXPERIENCE', sectionTitleSize, true, 4);
        
        resumeData.workExperience.forEach((exp: any) => {
          if (exp.company || exp.designation) {
            drawText(`${exp.designation} at ${exp.company}`, fontSize, true);
            if (exp.duration) drawText(exp.duration, fontSize - 1);
            if (exp.responsibilities) drawText(`• ${exp.responsibilities}`, fontSize - 1);
            yPosition -= 4;
          }
        });
        
        yPosition -= sectionSpacing;
      }
      
      if (resumeData.technicalSkills?.skills) {
        drawLine();
        drawText('TECHNICAL SKILLS', sectionTitleSize, true, 4);
        drawText(resumeData.technicalSkills.skills, fontSize);
        yPosition -= sectionSpacing;
      }
      
      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch (error: any) {
      throw new Error(`Failed to generate resume PDF: ${error.message}`);
    }
  }

  /**
   * Save PDF to file system
   */
  static async savePDFToFile(pdfBuffer: Buffer, fileName: string, dirPath: string = './downloads'): Promise<string> {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      const filePath = path.join(dirPath, fileName);
      fs.writeFileSync(filePath, pdfBuffer);
      return filePath;
    } catch (error: any) {
      throw new Error(`Failed to save PDF: ${error.message}`);
    }
  }

  /**
   * Remove HTML tags from content
   */
  private static stripHTML(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .trim();
  }

  /**
   * Generate a simple text-based resume
   */
  static generateTextResume(resumeData: any): string {
    const fullName = resumeData.personalInfo?.fullName || 'Your Name';
    const contact = [];
    if (resumeData.personalInfo?.email) contact.push(resumeData.personalInfo.email);
    if (resumeData.personalInfo?.phone) contact.push(resumeData.personalInfo.phone);
    
    const objectiveParts = [];
    if (resumeData.objective?.course) {
      objectiveParts.push('OBJECTIVE');
      objectiveParts.push('-'.repeat(40));
      let obj = `Pursuing ${resumeData.objective.course}`;
      if (resumeData.objective.specialization) {
        obj += ` with specialization in ${resumeData.objective.specialization}`;
      }
      objectiveParts.push(obj);
      objectiveParts.push('');
    }
    
    const educationParts = [];
    if (resumeData.education?.degree) {
      educationParts.push('ACADEMIC QUALIFICATION');
      educationParts.push('-'.repeat(40));
      educationParts.push(`${resumeData.education.degree} in ${resumeData.education.subject || 'Computer Science'}`);
      if (resumeData.education.university) educationParts.push(resumeData.education.university);
      if (resumeData.education.gpa) educationParts.push(`GPA: ${resumeData.education.gpa}`);
      if (resumeData.education.duration) educationParts.push(resumeData.education.duration);
      educationParts.push('');
    }
    
    const workParts = [];
    if (resumeData.workExperience?.length) {
      workParts.push('WORK EXPERIENCE');
      workParts.push('-'.repeat(40));
      resumeData.workExperience.forEach((exp: any) => {
        if (exp.designation) workParts.push(`• ${exp.designation} at ${exp.company || 'N/A'}`);
        if (exp.duration) workParts.push(`  ${exp.duration}`);
        if (exp.responsibilities) workParts.push(`  ${exp.responsibilities}`);
        workParts.push('');
      });
    }
    
    const skillsParts = [];
    if (resumeData.technicalSkills?.skills) {
      skillsParts.push('TECHNICAL SKILLS');
      skillsParts.push('-'.repeat(40));
      skillsParts.push(resumeData.technicalSkills.skills);
      skillsParts.push('');
    }
    
    return [
      fullName,
      '='.repeat(fullName.length),
      '',
      ...contact,
      ...(contact.length ? [''] : []),
      ...objectiveParts,
      ...educationParts,
      ...workParts,
      ...skillsParts,
    ].join('\n');
  }
}
