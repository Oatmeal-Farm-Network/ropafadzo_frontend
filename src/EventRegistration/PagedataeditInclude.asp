
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>
<table width = "<%=Screenwidth %>" border = "0" cellpadding = "0" cellspacing = "0" align = "center">
<%
x= 0

 sql = "select PageLayoutID from EventPageLayout where PageName = '" & Pagename & "' and EventID=" & EventID
		
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
if not rs.eof then
 PageLayoutID  = rs("PageLayoutID")
else
X = 0
		while X < 9
		 X = X + 1 
			Query =  "INSERT INTO EventPageLayout2 (EventID, BlockNum, PageLayoutID )" 
			Query =  Query & " Values (" &  EventID & ", " 
			Query =  Query &  " " &  X & ", " 
  			Query =  Query &  " " & PageLayoutID & " )" 

    if len(PageLayoutID) > 0 then
		Conn.Execute(Query) 
        end if
		wend
	end if 
	rs.close
	 sql = "select PageLayoutID from EventPageLayout where PageName = '" & Pagename & "' and EventID=" & EventID
		
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then
 		PageLayoutID  = rs("PageLayoutID")
	end if 

rs.close
 
sql = "select * from EventPageLayout2 where PageLayoutID  = " & PageLayoutID & " and EventPageLayout2.EventID=" & EventID & " order by BlockNum"
	
    response.write("sql=" & sql)	
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
while not rs.eof
x = x + 1
PageLayoutID = rs("PageLayoutID")
	BlockNum = rs("BlockNum")

	PageLayout2IDArray(x) = rs("PageLayout2ID")

	PageHeadingArray(BlockNum) = rs("PageHeading")
	
	str1 = PageHeadingArray(BlockNum)
	str2 = "&nbsp;"
	If InStr(str1,str2) > 0 Then
		PageHeadingArray(BlockNum)= Replace(str1,  str2, " ")
	End If 

	str1 = PageHeadingArray(BlockNum)
	str2 = "''"
	If InStr(str1,str2) > 0 Then
		PageHeadingArray(BlockNum) = replace(str1,  str2, "'")
	End If 

	EditImageArray(BlockNum) = rs("EditImage")
	PageHeadingArray(BlockNum) = rs("PageHeading")
	PageTextArray(BlockNum) = rs("PageText")
	
	
	str1 = PageTextArray(BlockNum)
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	PageTextArray(BlockNum)= Replace(str1,  str2, " ")
End If 

str1 = PageTextArray(BlockNum)
str2 = "''"
If InStr(str1,str2) > 0 Then
	PageTextArray(BlockNum)= Replace(str1,  str2, "'")
End If 


str1 = PageTextArray(BlockNum)
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	PageTextArray(BlockNum)= Replace(str1, str2 , vbCrLf)
End If  

	
	ImageArray(BlockNum) = rs("Image")
	ImageCaptionArray(BlockNum) = rs("ImageCaption")
	
	if ImageCaptionArray(BlockNum) = "0" then
   		ImageCaptionArray(BlockNum)= ""
	end if

	str1 =  ImageCaptionArray(BlockNum)
	str2 = "&nbsp;"
	If InStr(str1,str2) > 0 Then
		 ImageCaptionArray(BlockNum)= Replace(str1,  str2, " ")
	End If 

	str1 = ImageCaptionArray(BlockNum)
	str2 = "''"
	If InStr(str1,str2) > 0 Then
		ImageCaptionArray(BlockNum)= Replace(str1,  str2, "'")
	End If
	
str1 =  Trim(ImageCaptionArray(BlockNum))
	str2 = "0"
	If InStr(str1,str2) > 0 Then
		 ImageCaptionArray(BlockNum)= Replace(str1,  str2, "")
	End If 
 

	ImageOrientationArray(BlockNum) = rs("ImageOrientation")
	ImageLinkArray(BlockNum) = rs("ImageLink")
	
	str1 =  Trim(ImageLinkArray(BlockNum))
	str2 = "0"
	If InStr(str1,str2) > 0 Then
		 ImageLinkArray(BlockNum)= Replace(str1,  str2, "")
	End If 

UploadTextArray(BlockNum) = rs("UploadText")
UploadArray(BlockNum) = rs("Upload")
rs.movenext
wend

LastBlockNum = BlockNum
 x  = 1
 order = "even"
	 
	while x < (LastBlockNum + 1 ) 
   Block = x
	 ImageLink = ImageLinkArray(x)
	 Textblock =  x
	  TempPageLayout2ID = PageLayout2IDArray(x)
	  	
	 PageHeading = PageHeadingArray(x)
	 PageText = PageTextArray(x)
	 BlockImage = ImageArray(x)
	 ImageCaption = ImageCaptionArray(x)
	 ImageOrientation = ImageOrientationArray(x)
	 
     PageDownloadsID= PageDownloadsIDArray(x)
	 Upload = UploadArray(x)
	 UploadText = UploadTextArray(x)
	 UploadFile = "PageDatauploadImage.asp" ' changed from "PageDatauploadPageImage.asp" NEA 5/25/12
	 If BlockImageCaption= "0" Then
		BlockImageCaption = ""
	End If
	 
	
if len(PageText) > 1 then
For loopi=1 to Len( PageText )
    spec = Mid(PageText, loopi, 1)
    specchar = ASC(spec)
    if specchar < 32 or specchar > 126 then
	PageText= Replace(PageText,  spec, " ")

   end if
  
 Next
end if

 
	 	
if len(PageTitle) > 1 then
For loopi=1 to Len( PageTitle )
    spec = Mid(PageTitle, loopi, 1)
    specchar = ASC(spec)
    if specchar < 32 or specchar > 126 then
	PageTitle= Replace(TempPageText,  spec, " ")

   end if
  
 Next
end if

if len(PageHeading) > 1 then
For loopi=1 to Len(  PageHeading )
    spec = Mid(PageHeading, loopi, 1)
    specchar = ASC(spec)
    if specchar < 32 or specchar > 126 then
	 PageHeading= Replace( PageHeading,  spec, " ")

   end if
  
 Next
end if

if len(ImageCaption) > 1 then
For loopi=1 to Len(  ImageCaption )
    spec = Mid(ImageCaption, loopi, 1)
    specchar = ASC(spec)
    if specchar < 32 or specchar > 126 then
	 ImageCaption= Replace( ImageCaption,  spec, " ")

   end if
  
 Next
end if
 %>

	 <tr><td class = "body"  valign = "top">
<% PageTitleText = "Text Block" & x  %>
<!--#Include file="505Top.asp"-->
 <a name = "<%=Textblock%>"></a>
 
 
<%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>   

		<script language="javascript1.2">
  		// attach the editor to the textarea with the identifier 'textarea1'.
  		 WYSIWYG.attach("textarea1<%=Block%>");
		</script> 

	 		<form action= 'PageDataHandleForm2.asp?filename=<%=filename%>&EventID=<%=EventID%>' method = "post">
			<input name="TextBlock"  size = "60" value = "<%=Textblock%>" type = "hidden">

<input name="TempPageLayout2ID"  size = "60" value = "<%=TempPageLayout2ID%>" type = "hidden">
<input name="PageLayoutID"  size = "60" value = "<%=PageLayoutID%>" type = "hidden">
			
			

			<TEXTAREA NAME="Text" cols="65" rows="18" wrap="file" class = "body" id = "textarea1<%=Block%>"><%=PageText%></textarea><br>
			<input type=submit value = "Submit Changes"  size = "110" class = "regsubmit2" >
	        </form>
	 <form name="frmSend" method="POST" enctype="multipart/form-data" action="UploadaDownload.asp?PageLayoutID=<%=PageLayoutID%>&filename2=<%=filename%>&Blocknum=<%=Textblock%>&EventID=<%=EventID%>" >
		Upload a form or document (PDF, Word, or Excell only Max 500KB) <br>
		<% if len(Upload)> 1 then %>
			Download:  <b><%=right(Upload, len(Upload) - 9)%></b>
		<% end if %>
	<input name="attach1" type="file" size=35 class = "regsubmit2">
	<input  type=submit value="Upload" class = "regsubmit2">
</form>
<% if len(Upload)> 1 then %>

<form action= 'OtherPageRemoveUpload.asp?PageLayoutID=<%=PageLayoutID%>&filename2=<%=filename%>&Blocknum=<%=Textblock%>&EventID=<%=EventID%>' method = "post">
<input type = "Hidden" name="PageLayout2ID" value= "<%=TempPageLayout2ID %>" >
<input type = "Hidden" name="PageDownloadsID" value= "<%=PageDownloadsID %>" >
<input type = "Hidden" name="filename" value= "<%=filename%>" >
<input type=submit value="Remove File" class = "regsubmit2">
</form>

	<% end if %>
		 <!--#Include file="505Bottom.asp"-->
		 </td>
		 <td width = "5"><img src = "images/px.gif"</td>
	         	<td valign="top" width = "400">
	         	<% PageTitleText = "Image"  %>
<!--#Include file="444Top.asp"-->
	 					<table cellpadding = "0" cellspacing = "0" width = "400" >
	 					   <tr>
					     <td class = "body" height ="120">

					     <b>Images must be in .JPG, .JPEG, .GIF, or .PNG format and less than 300KB in size.</b><br> 
					     	<% If Len(BlockImage) > 2 Then %>
							<img src = "<%=BlockImage%>" height = "100"><br>
							<% Else %>
							<h2>No Image</h2>
							<% End If %>
							<form  method="POST" enctype="multipart/form-data" action="PageDatauploadImage.asp?PageLayout2ID=<%=TempPageLayout2ID%>&filename=<%=filename%>&EventID=<%=EventID%>" >
								Upload Photo: <br>
								<input name="attach1" type="file" size=35 class = "regsubmit2">
								<input  type=submit value="Upload" class = "regsubmit2">
							</form>
						<td>
						</tr>
						<tr>
							<td valign = "top" class = "body">
								<form method="POST" action="PageDataImageOrientation2.asp?filename=<%=filename%>" >
								<b>Orientation: </b>
										<select size="1" name="Orientation">
										<option value="<%=ImageOrientation%>" selected><%=ImageOrientation%></option>
										<option value="Left">Left</option>
										<option  value="Top">Top</option>
										<option  value="Right">Right</option>
										</select>
								
								<input type = "hidden" name="TempPageLayout2ID?filename=<%=filename%>&EventID=<%=EventID%>" value= "<%=TempPageLayout2ID%>" >
		<input name="TempPageLayout2ID"  size = "60" value = "<%=TempPageLayout2ID%>" type = "hidden">

									<input type = "hidden" name="OrientationImageID" value= "<%=Block %>" >

									
									<input type=submit value = "Submit"  size = "110" class = "regsubmit2"" >
									
									
									
								</form>
							</td>
						</tr>
							<tr>
						   <td class = "body">
							
						   </td>
						 </tr>
						<tr>
					    <td class = "body">
							<form action= 'RemovePageDataImage2.asp?filename=<%=filename%>' method = "post">
								<input type = "hidden" name="PageLayout2ID" value= "<%=TempPageLayout2ID %>" >
								<input type=submit value="Remove This Image" class = "regsubmit2">
							</form>
					</td>
				</tr>
	 </table>
<!--#Include file="444Bottom.asp"-->
	 			</td>
				</tr>

   	 	
   	<% 
   	x = x +1
   	wend%> 	

	   </table>

