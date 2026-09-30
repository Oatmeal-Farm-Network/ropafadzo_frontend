

<% 
	  
CustID = session("CustID")

conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" 


  sql = "select * from Pagelayout where PageName = 'News'"
'response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   

	
	 PageTitle = rs("PageTitle")
     PageHeading1= rs("PageHeading1")
     PageHeading2= rs("PageHeading2")
     PageHeading3= rs("PageHeading3")
     PageHeading4= rs("PageHeading4")
	 PageText1 = rs("PageText1")
	 PageText2 = rs("PageText2")
	 PageText3 = rs("PageText3")
	 PageText4 = rs("PageText4")
	 Image1= rs("Image1")
	 Image2= rs("Image2")
	 Image3= rs("Image3")
	 Image4= rs("Image4")
	 ImageCaption1= rs("ImageCaption1")
	 ImageCaption2= rs("ImageCaption2")
	 ImageCaption3= rs("ImageCaption3")
	 ImageCaption4= rs("ImageCaption4")
	 ImageOrientation1= rs("ImageOrientation1")
	 ImageOrientation2= rs("ImageOrientation2")
	 ImageOrientation3= rs("ImageOrientation3")
	 ImageOrientation4= rs("ImageOrientation4")


str1 = PageHeading1
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	PageHeading1= Replace(str1,  str2, " ")
End If 

str1 = PageHeading1
str2 = "''"
If InStr(str1,str2) > 0 Then
	PageHeading1= Replace(str1,  str2, "'")
End If 

str1 = PageHeading2
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	PageHeading2= Replace(str1,  str2, " ")
End If 

str1 = PageHeading21
str2 = "''"
If InStr(str1,str2) > 0 Then
	PageHeading2= Replace(str1,  str2, "'")
End If 

str1 = PageHeading3
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	PageHeading3= Replace(str1,  str2, " ")
End If 

str1 = PageHeading3
str2 = "''"
If InStr(str1,str2) > 0 Then
	PageHeading3= Replace(str1,  str2, "'")
End If 


str1 = PageHeading4
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	PageHeading4= Replace(str1,  str2, " ")
End If 

str1 = PageHeading4
str2 = "''"
If InStr(str1,str2) > 0 Then
	PageHeading4= Replace(str1,  str2, "'")
End If 

str1 =  ImageCaption1
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	 ImageCaption1= Replace(str1,  str2, " ")
End If 

str1 =  ImageCaption1
str2 = "''"
If InStr(str1,str2) > 0 Then
	 ImageCaption1= Replace(str1,  str2, "'")
End If 

str1 =  ImageCaption2
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	 ImageCaption2= Replace(str1,  str2, " ")
End If 

str1 =  ImageCaption2
str2 = "''"
If InStr(str1,str2) > 0 Then
	 ImageCaption2= Replace(str1,  str2, "'")
End If 

str1 =  ImageCaption3
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	 ImageCaption3= Replace(str1,  str2, " ")
End If 

str1 =  ImageCaption3
str2 = "''"
If InStr(str1,str2) > 0 Then
	 ImageCaption3= Replace(str1,  str2, "'")
End If 


str1 =  ImageCaption4
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	 ImageCaption4= Replace(str1,  str2, " ")
End If 

str1 =  ImageCaption4
str2 = "''"
If InStr(str1,str2) > 0 Then
	 ImageCaption4= Replace(str1,  str2, "'")
End If 







str1 = PageTitle
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	PageTitle= Replace(str1,  str2, " ")
End If 

str1 = PageTitle
str2 = "''"
If InStr(str1,str2) > 0 Then
	PageTitle= Replace(str1,  str2, "'")
End If 


str1 = PageText
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	PageText= Replace(str1, str2 , vbCrLf)
End If  

str1 =PageText
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	PageText= Replace(str1,  str2, " ")
End If 

str1 = PageText
str2 = "''"
If InStr(str1,str2) > 0 Then
	PageText= Replace(str1,  str2, "'")
End If 

str1 = PageText1
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	PageText1= Replace(str1, str2 , vbCrLf)
End If  

str1 =PageText1
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	PageText1= Replace(str1,  str2, " ")
End If 

str1 = PageText1
str2 = "''"
If InStr(str1,str2) > 0 Then
	PageText1= Replace(str1,  str2, "'")
End If 

str1 = PageText2
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	PageText2= Replace(str1, str2 , vbCrLf)
End If  

str1 =PageText2
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	PageText2= Replace(str1,  str2, " ")
End If 

str1 = PageText2
str2 = "''"
If InStr(str1,str2) > 0 Then
	PageText2= Replace(str1,  str2, "'")
End If 

str1 = PageText3
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	PageText3= Replace(str1, str2 , vbCrLf)
End If  

str1 =PageText3
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	PageText3= Replace(str1,  str2, " ")
End If 

str1 = PageText3
str2 = "''"
If InStr(str1,str2) > 0 Then
	PageText3= Replace(str1,  str2, "'")
End If 

str1 = PageText4
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	PageText4= Replace(str1, str2 , vbCrLf)
End If  

str1 =PageText4
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	PageText4= Replace(str1,  str2, " ")
End If 

str1 = PageText4
str2 = "''"
If InStr(str1,str2) > 0 Then
	PageText4= Replace(str1,  str2, "'")
End If 

%>





<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "680">
	<tr>
		<td Class = "body">
			<H2>News Page Content<br>
			<img src = "images/underline.jpg" width = "600"></H2>
			To update your text make your changes below and select the "submit Changes" button at the bottom of the form. To update your image please <a href = "#images" class = "body">click here</a>.<br><br>
		</td>
	</tr>
</table>


<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "680">
	<tr>
		<td valign = "top">
			 <form action= 'NewsPageHandleForm.asp' method = "post">
			<input name="TextBlock"  size = "60" value = "Heading" type = "hidden">

			<table border = "0" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "580">
  			<tr>
				<td  align = "right"   class = "body">
						<b>Page Heading: </b>
				</td>
				<td  align = "left" valign = "top" class = "body">
					<input name="Text"  size = "60" value = "<%=PageTitle%>">
				</td>
			</tr>
	<tr>
		<td  valign = "middle" colspan = "2" align = "center">
			<input type=submit value = "Submit Changes" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" Class = "body" >
		</td>
		</tr>
		</table>

</form>



<table border = "1" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
  <tr>
    <td>
<table border= "0">
<tr>
			<td  align = "center" class = "body" valign = "top" colspan= "2">
					<b>Text Block 1</b> </b>
			</td>
		</tr>
   <tr>
      <td >
<table border = "0" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
		
		<form action= 'NewsPageHandleForm.asp' method = "post">
			<input name="TextBlock"  size = "60" value = "TB1" type = "hidden">
		<tr>
			<td  align = "right"   class = "body">
					<b>Heading: </b>
			</td>
			<td  align = "left" valign = "top" class = "body">
					<input name="Heading"  size = "60" value = "<%=PageHeading1%>">
			</td>
		</tr>
		<tr>
			<td  align = "right" class = "body" valign = "top">
					<b>Text: </b>
			</td>
			<td  align = "left" valign = "top" class = "body">
					<TEXTAREA NAME="Text" cols="44" rows="16" wrap="file"><%=PageText1%></textarea>
			</td>
		</tr>
		<tr>
		<td  valign = "middle" colspan = "2" align = "center">
			<input type=submit value = "Submit Changes" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" Class = "body" >
		</td>
		</tr>
		</table>

</form>
	  </td>
	  <td valign = "top"  bgcolor = "bbbbbb">
			<table Border = "0" width = "150" align = "center">
			<tr>
				<td >
					<h2>Image</h2>
				</td>
			</tr>
			<tr>
				<td width = "100" align = "center">
				<% response.write("image1=")
				response.write("image1")
				%>
					<% If Len(Image1) > 2 Then %>
							<img src = "<%=Image1%>" height = "100">
					<% Else %>
							<h2>No Image</h2>
					<% End If %>
				</td>
			</tr>
			<tr>
				<td class = "body">
					<table>
					   <tr>
					     <td class = "body">
							<form name="frmSend" method="POST" enctype="multipart/form-data" action="NewsuploadPageImage.asp" >
								

								Upload Photo: <br>
								<input name="attach1" type="file" size=35 >
								<input  type=submit value="Upload">
							</form>
						<td>
						</tr>
						<tr>
					    <td class = "body">
							<form action= 'RemoveRanchPageImage.asp' method = "post">
								<input type = "hidden" name="ImageID" value= "AboutUsPageImage" >
								<input type=submit value="Remove This Image">
							</form>
					</td>
				</tr>
				</table>
	   <td>
	 </tr>
</table>
  <td>
	 </tr>
</table>


<a Name = "images"></a>


</td>
</tr>
</table>