



  

			
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  >
	<tr>
	     <td class = "body"  >	<br>	
		   <% If Len(Aboutusheading) > 1 Then %>
				<h1><%=Aboutusheading%></h1>
		   
		
			<% Else %>
					<h1><font color = "<%=TitleFontColor %>">About <%=CustCompany%></font></h1>
			<% End if %>


		</td>
	</tr>
	<tr>
		<td  class = "body">
				<table border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"   ><tr>
		     	<td  class = "body">
<font color = "<%=PageTextColor%>">
			<%
			TempOrientation = ImageOrientation1
			TempImage = Image1
			TempImageCaption = ImageCaption1
			TempHeading = PageHeading1
			TempPageText = PageText1
			
			%>
			
			<!--#Include file="CaptionedPageTextInclude.asp"-->	


		<%
			TempOrientation = ImageOrientation2
			TempImage = Image2
			TempImageCaption = ImageCaption2
			TempHeading = PageHeading2
			TempPageText = PageText2
			%>
			
			<!--#Include file="CaptionedPageTextInclude.asp"-->	

<%
			TempOrientation = ImageOrientation3
			TempImage = Image3
			TempImageCaption = ImageCaption3
			TempHeading = PageHeading3
			TempPageText = PageText3
			%>


					<!--#Include file="CaptionedPageTextInclude.asp"-->	


<%
			TempOrientation = ImageOrientation4
			TempImage = Image4
			TempImageCaption = ImageCaption4
			TempHeading = PageHeading4
			TempPageText = PageText4
			%>		
			<!--#Include file="CaptionedPageTextInclude.asp"-->	


</font>
				<br><br>
		</td>
	</tr>
</table>

		</td>
	</tr>
</table>
