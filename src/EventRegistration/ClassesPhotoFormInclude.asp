<%
Uploadpathwidth =44 	
If Len(CurrentClassInfoID ) > 0 Then 
  
	sql2 = "select * from ClassInfo  where ClassInfoID = " & CurrentClassInfoID 

	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	 
	if Not rs2.eof  then
	ClassInfoTitle = rs2("ClassInfoTitle")
		InstructorsImage = rs2("InstructorsImage")
		ClassImage1 = rs2("ClassImage1")
	    ClassImage2 = rs2("ClassImage2")
		ClassImage3 = rs2("ClassImage3")
		ClassImage4 = rs2("ClassImage4")
		ClassImage5 = rs2("ClassImage5")
		ClassImage6 = rs2("ClassImage6")
		ClassImage7 = rs2("ClassImage7")
		ClassImage8 = rs2("ClassImage8")	
		ClassImageCaption1 = rs2("ClassImageCaption1")
	    ClassImageCaption2 = rs2("ClassImageCaption2")
		ClassImageCaption3 = rs2("ClassImageCaption3")
		ClassImageCaption4 = rs2("ClassImageCaption4")
		ClassImageCaption5 = rs2("ClassImageCaption5")
		ClassImageCaption6 = rs2("ClassImageCaption6")
		ClassImageCaption7 = rs2("ClassImageCaption7")
		ClassImageCaption8 = rs2("ClassImageCaption8")								
	end if		
	
		rs2.close
		set rs2=nothing

	If Len(ClassImage1) > 2 Then
	else
		ClassImage1 = "/uploads/ImageNotAvailableSmall.jpg"
	End if

	If Len(ClassImage2) > 2 Then
	else
		ClassImage2 = "/uploads/ImageNotAvailableSmall.jpg"
	End if
	
	If Len(ClassImage3) > 2 Then
	else
		ClassImage3 = "/uploads/ImageNotAvailableSmall.jpg"
	End if
	
	If Len(ClassImage4) > 2 Then
	else
		ClassImage4 = "/uploads/ImageNotAvailableSmall.jpg"
	End if
	
	If Len(ClassImage5) > 2 Then
	else
		ClassImage5 = "/uploads/ImageNotAvailableSmall.jpg"
	End if			

	If Len(ClassImage6) > 2 Then
	else
		ClassImage6 = "/uploads/ImageNotAvailableSmall.jpg"
	End if	
	
	If Len(ClassImage7) > 2 Then
	else
		ClassImage7 = "/uploads/ImageNotAvailableSmall.jpg"
	End if	

	If Len(ClassImage8) > 2 Then
	else
		ClassImage8 = "/uploads/ImageNotAvailableSmall.jpg"
	End if	
'response.write(ClassImage5)
			str1 = ClassImage1
			str2 = "''"
			If InStr(str1,str2) > 0 Then
				ClassImage1= Replace(str1,  str2, "'")
			End If  	 

			str1 = ClassImage2
			str2 = "''"
			If InStr(str1,str2) > 0 Then
				ClassImage2= Replace(str1,  str2, "'")
			End If  
			
			str1 = ClassImage3
			str2 = "''"
			If InStr(str1,str2) > 0 Then
				ClassImage3= Replace(str1,  str2, "'")
			End If  
			
			str1 = ClassImage4
			str2 = "''"
			If InStr(str1,str2) > 0 Then
				ClassImage4= Replace(str1,  str2, "'")
			End If  
			
			str1 = ClassImage5
			str2 = "''"
			If InStr(str1,str2) > 0 Then
				ClassImage5= Replace(str1,  str2, "'")
			End If  
			
			str1 = ClassImage6
			str2 = "''"
			If InStr(str1,str2) > 0 Then
				ClassImage6= Replace(str1,  str2, "'")
			End If  			

			str1 = ClassImage7
			str2 = "''"
			If InStr(str1,str2) > 0 Then
				ClassImage7= Replace(str1,  str2, "'")
			End If  	

			str1 = ClassImage8
			str2 = "''"
			If InStr(str1,str2) > 0 Then
				ClassImage8= Replace(str1,  str2, "'")
			End If  	
			
	rs.close
%>
    <table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900"  align = "center">
		<tr>
			<td colspan = "2"><H1>Upload Photos for <%=ClassInfoTitle%></H1></td>
		</tr>
			<tr><td class = "body2" colspan  "3" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
				<tr><td class = "body2" colspan  "3"  height = "10"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
</table>



<a name = "Photos"></a>

 

<a name = "Photos"></a>

  <% PageTitleText = "Instructor's Image"  %>
<!--#Include file="940Top.asp"-->
<a name="InstructorsImage"></a>
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900"   align = "center">
		<tr>
			<td width = "150" align = "center" class = "body">
			<% if len(InstructorsImage) > 5 then %>
					<img src = "<%=InstructorsImage%>" height = "100">
			<% end if %>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImage.asp?ImageName=InstructorsImage&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">

						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>
					
					<form action= 'ClassesRemoveImage.asp' method = "post">
							<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" >
							<input type = "hidden" name="ImageName" value= "InstructorsImage" >
							<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
							<input type=submit value="Remove Image" class = "regsubmit2">
					</form>
			</td>
</tr>
</table>
<!--#Include file="940Bottom.asp"-->	
		
   <% PageTitleText = "Class Image 1"  %>
<!--#Include file="940Top.asp"-->
<br /><a name="ClassImage1"></a>
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900"   align = "center">
		<tr>
			<td width = "150" align = "center" class = "body">
				<% if len(ClassImage1) > 5 then %>
					<img src = "<%=ClassImage1%>" height = "100">
			<% end if %>

			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImage.asp?ImageName=ClassImage1&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">
						
						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>

				<form action= 'ClassesChangePhotoOrder.asp' method = "post">
				<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" >
					<input type = "hidden" name="CurrentPhoto" value= "1" >
					<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
					Photo Order:	<select size="1" name="PhotoOrder">
					<option value="1" selected>1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
				</select>
							<input type=submit value="Submit" class = "regsubmit2">
					</form>
					
					<form action= 'ClassesRemoveImage.asp' method = "post">
								<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" >
							<input type = "hidden" name="ImageName" value= "ClassImage1" >
							<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
							<input type=submit value="Remove Image" class = "regsubmit2">
					</form>
			</td>
		</table>



<!--#Include file="940Bottom.asp"-->	
		
   <% PageTitleText = "Class Image 2"  %>
<!--#Include file="940Top.asp"-->
<br />
<a name="ClassImage2"></a>
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900"   align = "center">
		<tr>
			<td width = "150" align = "center" class = "body">
				<% if len(ClassImage2) > 5 then %>
					<img src = "<%=ClassImage2%>" height = "100">
			<% end if %>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImage.asp?ImageName=ClassImage2&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">
						
						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>
				<form action= 'ClassesChangePhotoOrder.asp' method = "post">
				<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" >
					<input type = "hidden" name="CurrentPhoto" value= "2" >
					<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
					Photo Order:	<select size="1" name="PhotoOrder">
					<option value="2" selected>2</option>
					<option  value="1">1</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
				</select>
							<input type=submit value="Submit" class = "regsubmit2">
					</form>


					
					<form action= 'ClassesRemoveImage.asp' method = "post">
								<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" >
													<input type = "hidden" name="ImageName" value= "ClassImage2" >
							<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
							<input type=submit value="Remove Image" class = "regsubmit2">
					</form>
			</td>
		</table>
		
<!--#Include file="940Bottom.asp"-->	
		
   <% PageTitleText = "Class Image 3"  %>
<!--#Include file="940Top.asp"-->
<br />
<a name="ClassImage3"></a>
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900"   align = "center">
		<tr>
			<td width = "150" align = "center" class = "body">
				<% if len(ClassImage3) > 5 then %>
					<img src = "<%=ClassImage3%>" height = "100">
			<% end if %>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImage.asp?ImageName=ClassImage3&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">
						
						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>

				<form action= 'ClassesChangePhotoOrder.asp' method = "post">
				<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" >
					<input type = "hidden" name="CurrentPhoto" value= "3" >
					<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
					Photo Order:	<select size="1" name="PhotoOrder">
					<option value="3" selected>3</option>
					<option  value="1">1</option>
					<option  value="2">2</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
				</select>
							<input type=submit value="Submit" class = "regsubmit2">
					</form>

					
					<form action= 'ClassesRemoveImage.asp' method = "post">
								<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" >
						<input type = "hidden" name="ImageName" value= "ClassImage3" >
							<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
							<input type=submit value="Remove Image" class = "regsubmit2">
					</form>
			</td>
		</table>
		
		
	<!--#Include file="940Bottom.asp"-->	
		
   <% PageTitleText = "Class Image 4"  %>
<!--#Include file="940Top.asp"-->
<br />	
<a name="ClassImage4"></a>
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900"   align = "center">
		<tr>
			<td width = "150" align = "center" class = "body">
				<% if len(ClassImage4) > 5 then %>
					<img src = "<%=ClassImage4%>" height = "100">
			<% end if %>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImage.asp?ImageName=ClassImage4&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">
						
						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>

				<form action= 'ClassesChangePhotoOrder.asp' method = "post">
				<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" >
					<input type = "hidden" name="CurrentPhoto" value= "4" >
					<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
					Photo Order:	<select size="1" name="PhotoOrder">
					<option value="4" selected>4</option>
					<option  value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
				</select>
							<input type=submit value="Submit" class = "regsubmit2">
					</form>


					
					<form action= 'ClassesRemoveImage.asp' method = "post">
								<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" >
						<input type = "hidden" name="ImageName" value= "ClassImage4" >
							<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
							<input type=submit value="Remove Image" class = "regsubmit2">
					</form>
			</td>
		</table>
		
		
	<!--#Include file="940Bottom.asp"-->	
		
   <% PageTitleText = "Class Image 5"  %>
<!--#Include file="940Top.asp"-->
<br />	
<a name="ClassImage5"></a>
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900"   align = "center">
		<tr>
			<td width = "150" align = "center" class = "body">
						<% if len(ClassImage5) > 5 then %>
					<img src = "<%=ClassImage5%>" height = "100">
			<% end if %>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImage.asp?ImageName=ClassImage5&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">
					
						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>

				<form action= 'ClassesChangePhotoOrder.asp' method = "post">
				<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" >
					<input type = "hidden" name="CurrentPhoto" value= "5" >
					<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
					Photo Order:	<select size="1" name="PhotoOrder">
					<option value="5" selected>5</option>
					<option  value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					</select>
							<input type=submit value="Submit" class = "regsubmit2">
					</form>

					<form action= 'ClassesRemoveImage.asp' method = "post">
								<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" > 
									<input type = "hidden" name="ImageName" value= "ClassImage5" >
							<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
							<input type=submit value="Remove Image" class = "regsubmit2">
					</form>
			</td>
		</table>
		
		
<!--#Include file="940Bottom.asp"-->	
		
   <% PageTitleText = "Class Image 6"  %>
<!--#Include file="940Top.asp"-->
<br /><a name="ClassImage6"></a>
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900"   align = "center">
		<tr>
			<td width = "150" align = "center" class = "body">
				<% if len(ClassImage6) > 5 then %>
					<img src = "<%=ClassImage6%>" height = "100">
			<% end if %>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImage.asp?ImageName=ClassImage6&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">
					
						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>

				<form action= 'ClassesChangePhotoOrder.asp' method = "post">
				<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" >
					<input type = "hidden" name="CurrentPhoto" value= "6" >
					<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
					Photo Order:	<select size="1" name="PhotoOrder">
					<option value="6" selected>6</option>
					<option  value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
				</select>
							<input type=submit value="Submit" class = "regsubmit2">
					</form>


					
					<form action= 'ClassesRemoveImage.asp' method = "post">
								<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" >
									<input type = "hidden" name="ImageName" value= "ClassImage6" >
							<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
							<input type=submit value="Remove  Image" class = "regsubmit2">
					</form>
			</td>
		</table>
		
<!--#Include file="940Bottom.asp"-->	
		
   <% PageTitleText = "Class Image 7"  %>
<!--#Include file="940Top.asp"-->
<br /><a name="ClassImage7"></a>
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900"   align = "center">
		<tr>
			<td width = "150" align = "center" class = "body">
					<% if len(ClassImage7) > 5 then %>
					<img src = "<%=ClassImage7%>" height = "100">
			<% end if %>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImage.asp?ImageName=ClassImage7&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">

						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>

				<form action= 'ClassesChangePhotoOrder.asp' method = "post">
				<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" >
					<input type = "hidden" name="CurrentPhoto" value= "7" >
					<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
					Photo Order:	<select size="1" name="PhotoOrder">
					<option value="7" selected>7</option>
					<option  value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="8">8</option>
				</select>
							<input type=submit value="Submit" class = "regsubmit2">
					</form>

					
					<form action= 'ClassesRemoveImage.asp' method = "post">
								<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" >
											<input type = "hidden" name="ImageName" value= "ClassImage7" >
							<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
							<input type=submit value="Remove Image" class = "regsubmit2">
					</form>
			</td>
		</table>
		
<!--#Include file="940Bottom.asp"-->	
		
   <% PageTitleText = "Class Image 8"  %>
<!--#Include file="940Top.asp"-->
<br /><a name="ClassImage8"></a>
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900"   align = "center">
		<tr>
			<td width = "150" align = "center" class = "body">
			<% if len(ClassImage8) > 5 then %>
					<img src = "<%=ClassImage8%>" height = "100">
			<% end if %>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImage.asp?ImageName=ClassImage8&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">

						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>

				<form action= 'ClassesChangePhotoOrder.asp' method = "post">
				<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" >
					<input type = "hidden" name="CurrentPhoto" value= "8" >
					<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
					Photo Order:	<select size="1" name="PhotoOrder">
					<option value="8" selected>8</option>
					<option  value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
				</select>
							<input type=submit value="Submit" class = "regsubmit2">
					</form>

					
					<form action= 'ClassesRemoveImage.asp' method = "post">
							
								<input type = "hidden" name="ReturnPage" value= "ClassesPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=CurrentClassInfoID %>" >
							<input type = "hidden" name="ImageName" value= "ClassImage8" >
							<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
							<input type=submit value="Remove Image" class = "regsubmit2">
					</form>
			</td>
		</table>
<!--#Include file="940Bottom.asp"-->	
<% end if %>