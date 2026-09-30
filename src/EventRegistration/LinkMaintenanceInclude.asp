

<!--#Include file="LinksHeader.asp"--> 



<%
conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
 sql = "select * from Links"

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	rowcount = 1
	dim LinkID(40000)
	dim LinkText(40000)
	dim Link(40000)
	dim Linkdescription(40000)

	
Recordcount = rs.RecordCount +1
%>

<table border = "0">
   <tr>
    <td colspan = "3">
	
	


<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 align = "left">
	<tr>
		<td class = "body">
			<H2>Link Maintenance<br>
			<img src = "images/underline.jpg"></H2>
			Edit your changes in the tables below then select the "Submit Changes" button located under the table.<br><br>
			<b>Example:</b><br>
			  <font color = "blue">Link Name (www.WebsiteAddress.com)</font>  - Link description link description link descriptionlink descriptionlink descriptionlink descriptionlink descriptionlink descriptionlink descriptionlink descriptionlink descriptionlink description.<br><br>
			<br>
		</td>
	</tr>
</table>



	 </td>
	</tr>
	<tr>
	  <td>

	<form action= 'AddLinkhandleform.asp' method = "post">
<table border = "0"  bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "700" align = "left">
    <tr>
		<td class = "body" colspan = "2">
		<H2>Add a New Link<br>
			<img src = "images/underline.jpg" width = "700" height = "2"></H2>
		</td>
	</tr>
	<tr>
		<td width = "80" class = "body" align = "right">
			Title:
		</td>
		<td>
			<input name="LinkText" class = "body" size = "80">
		</td>
	</tr>
	<tr>
		<td class = "body" align = "right">
			Link Address:
		</td>
		<td class = "body">
			Http://<input name="Link" size = "72">
		</td>
	</tr>
  <tr>
      <td class = "body" align = "right">
	    Link Category:
	</td>
	<td>

					<% 
Dim CatID(100,100)
Dim CategoryName(100,100)


conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" 

			 sql = "select * from LinkCategoriesLookup  order by CategoryName " 
			'response.write(sql2)
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 
	CatCounter= 0
	 While Not rs.eof 
		CatCounter = CatCounter + 1
		CatID(CatCounter,0) = rs("CatID")
		CategoryName(CatCounter,0) = rs("CategoryName")
		'response.write(CategoryName(CatCounter,0))
		rs.movenext
	Wend
		FinalCatCounter = CatCounter

CatCounter= 0
SubCatCounter2 = 0
 %>
   

<select size="1" name="CatID">
					<option name = "ALinkID0" value= "" selected></option>
					<% count = 1
						While CatCounter < FinalCatCounter
						CatCounter= CatCounter +1
					%>
						<option name = "LinkCatID" value="<%=CatID(CatCounter,0)%>">
							<%=CategoryName(CatCounter,0)%>
						</option>
					<% 	count = count + 1
					wend %>
					</select>

     </td>
  </tr>
	<tr>
		<td class = "body" align = "right">
			Description:
		</td>
		<td>
			<textarea name="LinkDescription"  cols="80" rows="4"   class = "body"  ></textarea>
		</td>
	</tr>
	
	<tr>
		<td  align = "center" valign = "middle" colspan = "2">
			<input type=submit value = "Add Link" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
			</form>
		</td>
</tr>
</table>

  </td>
 
<%    

Dim linkID2(40000)
Dim LinkImage2(40000)
Dim LinkIDArray(1000)
Dim LinkTextArray(1000)
Dim LinkArray(1000)
Dim LinkDescriptionArray(1000)
Dim LinkImageArray(1000)
Dim CatIDArray2(1000)
Dim CatNameArray(1000)


%>

</tr>
  <tr>
		<td class = "body" colspan = "4">
		<H2>Edit Link Information<br>
			<img src = "images/underline.jpg" width = "700" height = "2"></H2>
		</td>
	</tr>

<%
conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
 sql = "select * from Links, LinkcategoriesLookup where Links.CatID = LinkCategoriesLookup.CatID"

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	rowcount = 1
	
	
Recordcount = rs.RecordCount +1
%>

<table border = "0">
 
<tr>
  <td colspan = "2">

<table border = "1" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
	
	<tr>
		<th >Image</th>
		<th >Category</th>
		<th  >Link Title /URL/Description</th>
		
	</tr>



	
<%
 While  Not rs.eof         
  CatNameArray(rowcount) =   rs("CategoryName")

	 LinkIDArray(rowcount) =   rs("LinkID")
	 LinkTextArray(rowcount) =   rs("LinkText")
	 LinkdescriptionArray(rowcount) =   rs("LinkDescription")
	CatIDArray2(rowcount) =   rs("LinkcategoriesLookup.CatID")
	LinkArray(rowcount) =   rs("Link")
	LinkImageArray(rowcount) =   rs("LinkImage")
	 LinkID2(rowcount) =   rs("LinkID")
LinkImage2(rowcount) =   rs("LinkImage")


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