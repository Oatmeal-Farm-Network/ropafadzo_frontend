<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Halter Class List Maintenance</title>
       <link rel="stylesheet" type="text/css" href="style.css">


</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
<!--#Include file="globalvariables.asp"--> 
<!--#Include file="Header.asp"--> 


	<form action= 'AddHalterClassListHandleform.asp' method = "post">
<table border = "0"  bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "700" align = "left">
    <tr>
		<td class = "body" colspan = "2">
		<H2>Add a New Link</H2>
		</td>
	</tr>
	<tr>
		<td width = "80" class = "body" align = "right">
			Class Name:</td>
		<td class = "body" align = "right">
			Full Fleece Code:
		</td>
		<td class = "body" align = "right">
			Shorn Class Code:
		</td>
      <td class = "body" align = "right">
	    Breed:
	</td>
  </tr>
  <tr>
	<td>
		<input name="ClassName" class = "body" size = "40">
	</td>
		<td class = "body">
			<input name="FullFleeceCode" size = "22">
		</td>
		<td class = "body">
			<input name="ShornCode" size = "22">
		</td>
	<td>
		<select size="1" name="Breed">
			<option name = "Breed" value= "Huacaya" selected></option>
			<option name = "Breed" value= "Suri" ></option>
			<option name = "Breed" value= "Paco-Vicuna" ></option>
		</select>
     </td>
  </tr>

   <tr>
	 <td  align = "center" valign = "middle" colspan = "2">
		<input type=submit value = "Add Link" style="regsubmit2" >
	</td>
</tr>
</table>
	</form>





<%
 sql = "select * from HalterClasslists where breed = 'Huacaya' and EventID= " & EventID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	rowcount = 1
	
	
Recordcount = rs.RecordCount +1
%>

<table border = "1" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
	<tr>
		<th>Image</th>
		<th>Category</th>
		<th>Link Title /URL/Description</th>
	</tr>

<%
 While  Not rs.eof         
  	CatNameArray(rowcount) =  	rs("CategoryName")
	LinkIDArray(rowcount) =   	rs("LinkID")
	LinkTextArray(rowcount) =  	rs("LinkText")
	LinkdescriptionArray(rowcount) =   rs("LinkDescription")
	CatIDArray2(rowcount) =   	rs("LinkcategoriesLookup.CatID")
	LinkArray(rowcount) =   	rs("Link")
	LinkImageArray(rowcount) =  rs("LinkImage")
	LinkID2(rowcount) =   		rs("LinkID")
	LinkImage2(rowcount) =   	rs("LinkImage")


%>
	<tr >
	 <td class = "body" valign = "top">
	 <% If Len(LinkImageArray(rowcount)) < 2 Then
	         LinkImageArray(rowcount) = "/uploads/ImageNotAvailable.jpg"
		End If %>

			<img src = "<%= LinkImageArray(rowcount)%>" width = "65"><br>
		   <a href = "AdminLinkPhotos.asp?LinkID=<%= LinkIDArray(rowcount)%>" class = "body" >Edit Photo</a>

		<form action= 'Linkhandleform.asp' method = "post">
		<input type = "hidden" name="LinkID(<%=rowcount%>)" value= "<%= LinkIDArray( rowcount)%>" >
		 </td>
		 <td nowrap valign = "top">
		 
		 
		 <% 		CatCounter= 0
					SubCatCounter2 = 0 %>
		          <select size="1" name="CatID(<%=rowcount%>)">
					<option name = "ALinkID0" value= "<%= CatIDArray2(rowcount)%>" selected><%= CatNameArray(rowcount)%></option>
					<% count = 1
						While CatCounter < FinalCatCounter
						CatCounter= CatCounter +1
					%>
						<option value="<%=CatID(CatCounter,0)%>">
							<%=CategoryName(CatCounter,0)%>
						</option>
					<% 	count = count + 1
					wend %>
					</select>
		 
		 </td>

		<td nowrap>
		    <table>
			    <tr>
				    <td colspan = "2" class= "body">Title: <input type = "Text" name="LinkText(<%=rowcount%>)" value= "<%= LinkTextArray( rowcount)%>" size = "56">
					</td>
				</tr>
				<tr>
					<td width = "200" valign = "top">
						http://<input type = "Text" name="Link(<%=rowcount%>)" value= "<%= LinkArray( rowcount)%>" >
					</td>
					<td>
						<textarea name="LinkDescription(<%=rowcount%>)"  cols="45" rows="7"   class = "body"  ><%= LinkDescriptionArray( rowcount)%></textarea>
					</td>
				</tr>
			</table>
		
		</td>
	</tr>
	

<%
		rowcount = rowcount + 1
	   rs.movenext
	Wend
TotalCount=rowcount 
	rs.close
  set rs=nothing
  set conn = nothing
%>

<tr>
		<td colspan = "8" align = "center" valign = "middle">
			<img src = "images/underline.jpg"><br>
			<Input type = Hidden name='TotalCount' value = <%=TotalCount%> >
			<input type=submit value = "Submit Changes" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
			</form>
		</td>
</tr>
</table>
 <br><br>


  </td>
</tr>
<tr>
  <td colspan = "2">




				<%  
				dim aID(40000)
				dim aLinkText(40000)
				dim aLink(40000)

				conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
				"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" 
				sql2 =  "select * from Links"

			acounter = 1
			Set rs2 = Server.CreateObject("ADODB.Recordset")
			rs2.Open sql2, conn, 3, 3 
	
			While Not rs2.eof  
				aID(acounter) = rs2("LinkID")
				aLinkText(acounter) = rs2("LinkText")
				aLink(acounter) = rs2("Link")

		acounter = acounter +1
		rs2.movenext
	Wend		
	
		rs2.close
		set rs2=nothing
		set conn = nothing



%>

	</td>
	</tr>
</table>


<table border = "0" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
	<tr>
		<td valign = "top" >
			<H2>Delete a Link<br>
			<img src = "images/underline.jpg" width = "300" height = "2"></H2>
			<form action= 'DeleteLinkhandleform.asp' method = "post">
				<input type = "hidden" name="PhotoType" value= "ListPage">
			   <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
			   <tr>
				 <td valign = "top">
				 
					<b>Link's Name</b><br>
					<select size="1" name="ID">
					<option name = "AID0" value= "" selected></option>
					<% count = 1
						while count < acounter
						response.write(count)
					%>
						<option name = "AID1" value="<%=aID(count)%>">
							<%=aLinkText(count)%> (<%=aLink(count)%>)
						</option>
					<% 	count = count + 1
					wend %>
					</select>
				</td>
				<td>
					<br>
					<input type=submit value = "Delete" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
				</td>
			  </tr>
		    </table>
		  </form>
		</td>
	</tr>
</table>
<br><br><br><br>
<br><br><br><br>
<!--#Include file="Footer.asp"-->
</Body>
</HTML>