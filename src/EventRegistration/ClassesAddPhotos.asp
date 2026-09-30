<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<%@ Language=VBScript %>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Class Facts</title>
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="The Andresen Group"/>
<link rel="stylesheet" type="text/css" href="/style.css" />
 </head>
 
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<% Current = "admin" %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "Classes" %>
<!--#Include file="OverviewHeader.asp"-->
<!'--#Include file="HeaderTabsIncludeBottom.asp"-->
<!'--#Include file="Scripts.asp"--> 


<!'--#Include File ="Header.asp"--> 
<!'--#Include File ="ClassesHeader.asp"--> 


 <% PageTitleText = "Add a Class - Step 2: Add Class Photos"  %>
<!--#Include file="970Top.asp"-->

	 	<a href = "ClassesAdd.asp?EventID=<%=EventID%>" class = "body">Add Classes</a> |&nbsp; 
		<a href = "ClassesEditDetails.asp?EventID=<%=EventID%>#Edit" class = "body">Edit Classes</a> |&nbsp; 
<br />
<% 
'rowcount = CInt
rowcount = 1

ClassInfoID= Request.Querystring("ClassInfoID")
EventID = Request.Querystring("EventID")
CurrentClassInfoID= Request.Querystring("ClassInfoID")

 If Len(ClassInfoID) > 0 Then 
	sql2 = "select * from ClassInfo  where ClassInfoID = " & ClassInfoID
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
	if Not rs2.eof  then
		ClassImage1 = rs2("ClassImage1")
	    ClassImage2 = rs2("ClassImage2")
		ClassImage3 = rs2("ClassImage3")
		ClassImage4 = rs2("ClassImage4")
		ClassImage5 = rs2("ClassImage5")
		ClassImage6 = rs2("ClassImage6")
		ClassImage7 = rs2("ClassImage7")
		ClassImage8 = rs2("ClassImage8")		
		InstructorsImage= rs2("InstructorsImage")					
	end if		
	
		rs2.close
		set rs2=nothing
		
%>



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
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImageAdd.asp?ImageName=InstructorsImage&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">

						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>
					
					<form action= 'ClassesRemoveImage.asp' method = "post">
							<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" >
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
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImageAdd.asp?ImageName=ClassImage1&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">
						
						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>

				<form action= 'ClassesChangePhotoOrder.asp' method = "post">
				<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" >
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
								<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" >
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
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImageAdd.asp?ImageName=ClassImage2&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">
						
						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>
				<form action= 'ClassesChangePhotoOrder.asp' method = "post">
				<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" >
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
								<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" >
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
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImageAdd.asp?ImageName=ClassImage3&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">
						
						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>

				<form action= 'ClassesChangePhotoOrder.asp' method = "post">
				<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" >
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
								<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" >
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
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImageAdd.asp?ImageName=ClassImage4&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">
						
						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>

				<form action= 'ClassesChangePhotoOrder.asp' method = "post">
				<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" >
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
								<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" >
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
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImageAdd.asp?ImageName=ClassImage5&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">
					
						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>

				<form action= 'ClassesChangePhotoOrder.asp' method = "post">
				<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" >
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
								<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" > 
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
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImageAdd.asp?ImageName=ClassImage6&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">
					
						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>

				<form action= 'ClassesChangePhotoOrder.asp' method = "post">
				<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" >
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
								<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" >
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
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImageAdd.asp?ImageName=ClassImage7&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">

						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>

				<form action= 'ClassesChangePhotoOrder.asp' method = "post">
				<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" >
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
								<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" >
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
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="ClassesUploadImageAdd.asp?ImageName=ClassImage8&ClassInfoID=<%=CurrentClassInfoID %>" onSubmit="return onSubmitForm();">

						Upload New Photo: <input name="attach1" type="file" size=45 class = "regsubmit2">
						<input  type=submit value="Upload" class = "regsubmit2">
					</form>

				<form action= 'ClassesChangePhotoOrder.asp' method = "post">
				<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" >
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
							
								<input type = "hidden" name="ReturnPage" value= "ClassesAddPhotos.asp?EventID=<%= EventID %>&ClassInfoID=<%=ClassInfoID %>" >
							<input type = "hidden" name="ImageName" value= "ClassImage8" >
							<input type = "hidden" name="ClassInfoID" value= "<%= CurrentClassInfoID %>" >
							<input type=submit value="Remove Image" class = "regsubmit2">
					</form>
			</td>
		</table>
<!--#Include file="940Bottom.asp"-->	

<% Else %>
	

 <% End if %>
<br />

<!--#Include file="970Bottom.asp"-->

<!--#Include virtual="Footer.asp"-->
</Body>
</HTML>